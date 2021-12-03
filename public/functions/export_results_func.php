<?php

require_once('../../vendor/autoload.php');
require_once('../requires/create_export_table.php');

use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;



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
        $apiUrl = $_POST['apiUrl'];
    }
    else {
        echo 'Could not retrieve API URL.';
    }
    
    $project = new RedCapProject($apiUrl, $apiToken, true);
    if(!isset($project)) {
        echo 'Could not create connection to REDCap API.  Please check your API token or entered URL and try again.';
    }
    
    if(isset($_POST['instruments']) && !empty($_POST['instruments'])) {
        //Pulls the instrument (project) the user selected from the project creation form (create_form.php)
        $formName =  $_POST['instruments'];  
        //Separate the directory by / and save the instrument name (last folder) in the variable
        $formName = explode(DIRECTORY_SEPARATOR, $formName);
        //Get the folder at the end of the path
        $formName = $formName[(sizeof($formName)-1)];  
    }
    else {
        echo 'Could not retrieve list of instruments from project.';
    }

    //Get the field name of the record ID field from the user's input
    if(isset($_POST['fieldName']) && !empty($_POST['fieldName'])) {
        $idField = $_POST['fieldName'];
    }
    else {
        echo 'Error: The selected instrument name from the project could not be retrieved.';
    }
    
    //Pulls metadata and the list of instruments from the project for the given form
    $meta = $project->exportMetadata('json', [$idField], [$formName]);
}
catch(PhpCapException $exception) {
    echo $exception->getMessage();
}


//Check if path to the project exists, get it in a variable if so
if(isset($_POST['instruments']) && !empty($_POST['instruments'])) {
    $projectPath = $_POST['instruments'] . DIRECTORY_SEPARATOR;
    if(!file_exists($projectPath)) {
        echo "Directory does not exist.  Please validate the project name.\r\n";
    }
}

//Get the first record of the form and then parse it so we only have the header data
$formData = $project->exportRecords('csv', 'flat', [1], [$idField], [$formName]);
$formData = explode(PHP_EOL, $formData);
$formData = $formData[0];

//Can't tell whether to check for only data_1.csv or more...
//The previous data_1 should get replaced when recognizing again,
//so there should only be a data_1.csv
$csvFilename = $projectPath.DIRECTORY_SEPARATOR.'data_1.csv';
$sdapsCsv = fopen($csvFilename, 'r+');
if(!$sdapsCsv) {
    echo "Failed to open file at " . $csvFilename . "\r\n";
}

//Create the final csv file to be uploaded to REDCap
$finalCsv = fillRecords($formData, $meta, $sdapsCsv);

//Close the stream open on SDAPS's csv file
fclose($sdapsCsv);

$importedIds = $project->importRecords($finalCsv, 'csv', 'flat', 'overwrite', 'YMD', 'ids', false);

echo 'Imported data for records:';
foreach($importedIds as $key => $id) {
    if($key === (sizeof($importedIds)-1)) {
        echo ' '.$id.".\r\n";
    }
    else {
        echo ' '.$id.',';
    }
}

?>