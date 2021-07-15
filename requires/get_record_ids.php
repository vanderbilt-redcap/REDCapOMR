<?php

require_once('../vendor/autoload.php');
                
use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;

try {
    if(isset($_POST['apiToken']) && !empty($_POST['apiToken'])) {
        $apiToken = $_POST['apiToken'];
    }
    else {
        echo "Error: API token for given institution name is invalid.";
    }

    if(isset($_POST['apiUrl']) && !empty($_POST['apiUrl'])) {
        $apiUrl = 'https://redcap.' . strtolower($_POST['apiUrl']) . '.edu/api/';
    }
    else {
        echo "Error: Institution name for given API token in invalid.";
    }

    if(isset($_POST['instruments']) && !empty($_POST['instruments'])) {
        $instruments = $_POST['instruments'];
    }
    else {
        echo "Error: The selected instrument name from the project could not be retrieved.";
    }

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
catch(PhpCapException $exception) {
    print $exception->getMessage();
}

echo json_encode($records);

?>