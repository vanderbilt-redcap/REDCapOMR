<?php

require_once('../vendor/autoload.php');
                
use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;

$json = array();

try {
    if(isset($_POST['apiToken']) && !empty($_POST['apiToken'])) {
        $apiToken = $_POST['apiToken'];
    }
    else {
        $json['error'] = 'Error: API token for given institution name is invalid.';
        die(json_encode($json));
    }

    if(isset($_POST['apiUrl']) && !empty($_POST['apiUrl'])) {
        $apiUrl = 'https://redcap.' . strtolower($_POST['apiUrl']) . '.edu/api/';
    }
    else {
        $json['error'] = 'Error: Institution name for given API token in invalid.';
        die(json_encode($json));
    }

    if(isset($_POST['instruments']) && !empty($_POST['instruments'])) {
        $instruments = $_POST['instruments'];
    }
    else {
        $json['error'] = 'Error: The selected instrument name from the project could not be retrieved.';
        die(json_encode($json));
    }

    if((isset($_POST['apiToken']) && !empty($_POST['apiToken'])) &&
       (isset($_POST['apiUrl']) && !empty($_POST['apiUrl'])) &&
       (isset($_POST['instruments']) && !empty($_POST['instruments']))) {
        //$sslVerify = true;
        $project = new RedCapProject($apiUrl, $apiToken/*, $sslVerify*/);
        //Pull records of the project from REDCap for the given form (instrument)
        $allRecords = $project->exportRecords('csv', 'flat', null, null, [$instruments]);

        //Separate the rows of the csv file to subarrays
        $rows = explode(PHP_EOL, $allRecords);

        //Array to hold only record IDs of the REDCap project
        $records = array();

        //Loop through each non-header row and select only the record ID
        for($i = 1; $i < sizeof($rows)-1; $i++) {
            //Returns the first value in the exploded array (the record ID)
            $records[$i-1] = current(explode(',', $rows[$i]));
        }
    }
    else {
        $json['error'] = 'Error: Could not create connection to REDCap project.  API token or URL given are incorrect.';
        die(json_encode($json));
    }
} 
catch(PhpCapException $exception) {
    $json['error'] = $exception->getMessage();
    die(json_encode($json));
}

$json['results'] = $records;
echo json_encode($json);

?>