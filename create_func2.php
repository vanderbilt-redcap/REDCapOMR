<?php

require_once('vendor/autoload.php');
require_once("requires/json2latex.php");

use JansenFelipe\SdapsPHP\SdapsPHP;
use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;



    /**
     * Saves the .tex file to the specified directory.
     * If no directory is specified, the file gets saved in the current working directory.
     * Utilizes the /tmp directory for temporary files currently.
     * 
     * @throws Exception
     * @return string filePath
     */
    function saveTex($tex, $filePath = '') {
        if($filePath != '') {
            if(!file_exists($filePath)) {
                mkdir($filePath);
            }
            file_put_contents($filePath.'questionnaire.tex', $tex);
        }
    
        if($filePath != '') {
            file_put_contents('questionnaire.tex', $tex);
        }

        //Return the path to the questionnaire
        return $filePath.'questionnaire.tex';
    }


    /**
     * Adds the number of user-specified records to the end of the record list on REDCap.
     * Last record index is retrieved with REDCap API method "Generate Next Record Name", and
     * questions are added to it
     */
    function createRecords($meta, $formName, $start, $num) {
        $csv = '';

        $meta = json_decode($meta);
        
        //Append each question from form to the "csv" import string
        foreach($meta as $key => $val) {
            //If the first value in the file isn't record_id, add it
            //so REDCap knows which record to append the content to
            if($key == 0 && $val->field_name !== 'record_id') {
                $csv = 'record_id' . ',';
            }

            //Checkbox fields have multiple fields equal to the number of answers they have, need to be appended here
            if($val->field_type === 'checkbox') {
                //Fields are laid out as question = rpps_s_q1 -> rpps_s_q1___1, rpps_s_q1___2, rpps_s_q1___3, etc
                $choices = explode('|', $val->select_choices_or_calculations);
                $numChoices = count($choices);

                for($i = 1; $i <= $numChoices; $i++) {
                    //Appends field name (rpps_s_q1) to ___ and adds $i to = rpps_s_q1___1,rpps_s_q1___2,rpps_s_q1___3,etc
                    $csv = $csv . $val->field_name . '___' . $i . ',';
                }
            }
            //Descriptive fields aren't included in the record import since they aren't answerable
            else if($val->field_type !== 'descriptive') {
                $csv = $csv . $val->field_name . ',';
            }
        }
        //Add the final required field for import record that identifies if the survey is complete
        $csv = $csv . $formName . '_complete';

        //Get the number of separators to add in that many to "fill in" the fields in the imports
        $numSeparators = substr_count($csv, ',');

        //Fill in empty values for each record desired
        for($i = $start; $i <= $start+$num; $i++) {
            //Insert record ID into string
            $csv = $csv . "\r\n" . $i;
            for($j = 0; $j < $numSeparators; $j++) {
                //Insert separators
                $csv = $csv . ',';
            }
            //Adds the value equivalent to "Incomplete" for form completeness variable at end of survey
            $csv = $csv . '0';
        }

        return $csv;
    }



try {
    if(isset($_POST['apiToken']) && !empty($_POST['apiToken'])) {
        //Pulls the API token from the project that the user gave in the project creation form
        $apiToken = $_POST['apiToken'];
    }
    else {
        echo 'Could not retrieve API token.';
    }

    if(isset($_POST['apiUrl']) && !empty($_POST['apiUrl'])) {
        //Concats the API url of the user's distribution of REDCap given in the project creation form
        $apiUrl = 'https://redcap.' . strtolower($_POST['apiUrl']) . '.edu/api/';
    }
    else {
        echo 'Could not retrieve API URL from university REDCap domain.';
    }

    //$sslVerify = true;
    $project = new RedCapProject($apiUrl, $apiToken/*, $sslVerify*/);

    if(isset($_POST['instruments']) && !empty($_POST['instruments'])) {
        //Pulls the instrument (project) the user selected from the project creation form (create_form.php)
        $formName = $_POST['instruments'];    
    }
    else {
        echo 'Could not retrieve list of instruments from project.';
    }

    //Pulls metadata and the list of instruments from the project for the given form
    $meta = $project->exportMetadata('json', [], [$formName]);
    $instruments = $project->exportInstruments('json');
}
catch(PhpCapException $exception) {
    echo $exception->getMessage();
}



//Creates the LaTeX questionnaire of the REDCap data dictionary
$tex = json2latex::createQuestionnaire($meta, $instruments, $_POST['apiUrl']);
//Saves the questionnaire to the /tmp/ dir
$texPath = saveTex($tex, 'tmp'.DIRECTORY_SEPARATOR);

//Gets the user's entered project name in the project creation form
$projName = $_POST['projName'];
//Removes non-alphanumeric characters from file name
$projName = preg_replace('/[^\p{L}\p{N} ]+/', '', $projName);
//Create the project path in the structure of tmp/$projName
$projectPath = 'tmp'.DIRECTORY_SEPARATOR.$projName;


//Gets the index after the last record ID present in the project
$start = (int)$project->generateNextRecordName();

//Since we start at index 1 and not 0, we have to subtract 1 to avoid making 1 extra survey with range
if(($num = $_POST['docNum']-1) > -1) { 
    //Creates document count from start index to start index + number count - 1
    $docs = range($start, $start+$num);

    //Gets the records in CSV format and imports them into REDCap project as blank records
    $csv = createRecords($meta, $formName, $start, $num);
    
    //Try to import blank records, if it fails then we continue as normal
    try {
        $returnedIds = $project->importRecords($csv, 'csv', 'flat', 'overwrite', 'YMD', 'ids', false);
    }
    catch(PHPCapException $exception) {
        echo $csv."\r\n";
        echo $exception->getMessage()."\r\n";
    }
}



if(($projectPath = SdapsPHP::createProject($projectPath, $texPath)) !== '') {

    //Deletes generated .tex file in tmp/ directory
    unlink($texPath);

    if($num >= 0) {
        SdapsPHP::stampIDs($projectPath, $docs);
    }
    else {
        echo "You did not create any stamped IDs with your project.  Go to 'Create Printouts' to add them.\r\n";
    }

    echo $projectPath;
}
else {
    echo 'Could not create project directory '. $projectPath . ".  \r\nPlease ensure that all form fields were given proper values.";
}
?>