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

    //$sslVerify = true;
    $project = new RedCapProject($apiUrl, $apiToken/*, $sslVerify*/);
    //Pull field names of the project from REDCap
    $fields = $project->exportFieldNames('json');
} 
catch(PhpCapException $exception) {
    echo $exception->getMessage();
}

echo $fields;

?>