<?php

require_once('vendor/autoload.php');

use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;



    /**
     * Cleans data from SDAPS csv file from csv export and puts it into a
     * REDCap-readable form for the current instrument.
     * 
     * Groups forms in an array by question fields, so that we get a structure
     * of $csvFile[row][question][answers] where answers are headers for the first
     * row and are radio value or binary true/false values for questionnaire rows
     */
    function fillRecords($redcapFormData, $meta, $sdapsData) {
        $meta = json_decode($meta);
        //Get array of field types to perform logic on SDAPS csv file
        $formFieldTypes = array();
        $formChoices = array();

        $index = 0;
        //Store field type values in array
        foreach($meta as $key => $val) {
            //Don't include descriptive fields lik with empty form creation
            if($val->field_type !== 'descriptive') {
                $formFieldTypes[$index] = $val->field_type;

                //Make array of answers
                $formChoices[$index] = explode('|', $val->select_choices_or_calculations);
                //Remove all numeric characters before the first comma
                $formChoices[$index] = preg_replace('/,.*$/', '', $formChoices[$index]);
        
                foreach($formChoices[$index] as $num => $choice) {
                    $formChoices[$index][$num] = trim($choice);
                }

                $index++;
            }
        }


        //Create the vars to hold the csv with parsed data without "review" cols
        //AND global_id, empty, valid, recognized, review, verified (index 1-6)
        $trimmedCsv = array();
        //Array to skip pointless first columns 1-6 (2-7 in non-array format)
        $avoidIndex = range(1,6);
        //Array to hold index values of review cols to skip
        $reviewIndex = array();

        //Loop through each row
        for($i = 0; ($data = fgetcsv($sdapsData, 0, ',')) !== false; $i++) {
            $j = 0;
            $k = 0;

            //For each row in the csv file... 
            foreach($data as $key => $val) {
                //Don't include skipped rows in trimmed csv file
                if(in_array($key, $avoidIndex)) {
                    continue;
                }
                //Don't include cols that have review in them
                else if(strpos($val, 'review') !== false) {
                    //Add the review indices to array so they can be skipped in questionnaire rows
                    array_push($reviewIndex, $key);
                    
                    //Only increment once, if the previous col had review we don't increment again
                    if((strpos($data[$key-1], 'review')) === false) {
                        $j++;
                    }
                    $k = 0;
                }
                //For questionnaire rows, don't include flagged review cols
                else if(in_array($key, $reviewIndex)) {
                    //Only increment once, if the previous col had review we don't increment again
                    if((strpos($data[$key-1], 'review')) === false) {
                        $j++;
                    }
                    $k = 0;
                }
                //Add value of cell to trimmed csv array
                else {
                    // 
                    $trimmedCsv[$i][$j][$k] = $val;
                    $k++;
                }
            }
        }

        
        for($i = 1; $i < sizeof($trimmedCsv); $i++) {
            for($j = 0; $j < sizeof($trimmedCsv[$i]); $j++) {
                if(!isset($trimmedCsv[$i][$j])) {
                    unset($trimmedCsv[$i][$j]);
                    $trimmedCsv[$i] = array_values($trimmedCsv[$i]);
                }
            }
        }


        //Create our final csv file to be sent to the server
        $csv = $redcapFormData . "\r\n";

        //We skip the first row with the form headers, we only care about the content
        //i references the rows of the csv, j references the REDCap header field we're on
        for($i = 1; $i < sizeof($trimmedCsv); $i++) {
            for($j = 0; $j < count($trimmedCsv[$i]); $j++) {
                //For our record_id field, we just add the value to the csv file
                if($j === 0) {
                    $csv = $csv . $trimmedCsv[$i][0][0] . ',';
                }
                //We don't have support for OCR, so we enter nothing for those fields
                else if($formFieldTypes[$j] === 'text' || $formFieldTypes[$j] === 'notes') {
                    $csv = $csv . ',';
                }
                //Add support for radio buttons
                else if($formFieldTypes[$j] === 'radio') {
                    //If multiple fields or no fields are checked, we don't add an answer to be safe
                    if($trimmedCsv[$i][$j][0] === 'error-multi-select' || $trimmedCsv[$i][$j][0] === 'NA') {
                        $csv = $csv . ',';
                        continue;
                    }
                    else {
                        //If our answer choices don't start at 1, adjust the final answer to avoid data insertion errors
                        if($formChoices[$j][0] != 1) {
                            //Calculate the difference between the standard start index of 1 and the actual start index for the col
                            $diff = $formChoices[$j][0] - 1;
                            
                            //Add the difference from the selected value to get the REDCap form's desired answer
                            $trimmedCsv[$i][$j][0] = $trimmedCsv[$i][$j][0] + $diff;
                        }

                        //Record the answer into the csv result to go to REDCap
                        $csv = $csv . $trimmedCsv[$i][$j][0] . ',';
                    }
                }
                //Add support for checkboxes
                else if($formFieldTypes[$j] === 'checkbox') {
                    //Iterate through each checkbox choice and add to csv
                    foreach($trimmedCsv[$i][$j] as $key => $val) {
                        $csv = $csv . $trimmedCsv[$i][$j][$key] . ',';
                    }
                }
                //We should never hit this since all field types are accounted for currently,
                //but we include a check for errant types anyway
                else {
                    $csv = $csv . ',';
                }
            }
            //Append the record status to the end and start new line (should be 1 since not reviewed)
            $csv = $csv . "1\r\n";
        }

        return $csv;
    }


try {
    if(isset($_POST['apiToken']) && !empty($_POST['apiToken'])) {
        //Pulls the API token from the project that the user gave in the project creation form
        $apiToken = $_POST['apiToken'];
    }
    else {
        echo 'Error: Could not retrieve API token.';
    }
    
    if(isset($_POST['apiUrl']) && !empty($_POST['apiUrl'])) {
        //Concats the API url of the user's distribution of REDCap given in the project creation form
        $apiUrl = 'https://redcap.' . strtolower($_POST['apiUrl']) . '.edu/api/';
    }
    else {
        echo 'Error: Could not retrieve API URL from university REDCap domain.';
    }
    
    //$sslVerify = true;
    $project = new RedCapProject($apiUrl, $apiToken/*, $sslVerify*/);
    
    if(isset($_POST['instruments']) && !empty($_POST['instruments'])) {
        //Pulls the instrument (project) the user selected from the project creation form (create_form.php)
        $formName = $_POST['instruments'];    
    }
    else {
        echo 'Error: Could not retrieve list of instruments from project.';
    }
    
    //Pulls metadata and the list of instruments from the project for the given form
    $meta = $project->exportMetadata('json', [], [$formName]);
}
catch(PhpCapException $exception) {
    echo $exception->getMessage();
}


//Check if path to the project exists, get it in a variable if so
if(isset($_POST['projectPath']) && !empty($_POST['projectPath'])) {
    $projectPath = str_ireplace('..'.DIRECTORY_SEPARATOR, '', $_POST['projectPath']) . DIRECTORY_SEPARATOR;
    if(!file_exists($projectPath)) {
        echo "Error: Directory does not exist.  Please validate the project name.\r\n";
    }
}

//Get the first record of the form and then parse it so we only have the header data
$formData = $project->exportRecords('csv', 'flat', [1], null, [$formName]);
$formData = explode(PHP_EOL, $formData);
$formData = $formData[0];

//Can't tell whether to check for only data_1.csv or more...
//The previous data_1 should get replaced when recognizing again,
//so there should only be a data_1.csv
$csvFilename = $projectPath.DIRECTORY_SEPARATOR.'data_1.csv';
$sdapsCsv = fopen($csvFilename, 'r+');
if(!$sdapsCsv) {
    echo "Error: Failed to open file at " . $csvFilename . "\r\n";
}

//Create the final csv file to be uploaded to REDCap
$finalCsv = fillRecords($formData, $meta, $sdapsCsv);

//Close the stream open on SDAPS's csv file
fclose($sdapsCsv);

//$importedIds = $project->importRecords($finalCsv, 'csv', 'flat', 'overwrite', 'YMD', 'ids', false);

//Return the new csv file to the js program
echo $finalCsv;

?>