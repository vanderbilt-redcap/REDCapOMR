<?php

require_once('../../vendor/autoload.php');
                
use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;

try {
    if(isset($_POST['apiToken']) && !empty($_POST['apiToken'])) {
        $apiToken = $_POST['apiToken'];
    }
    else {
        echo "Error: API token for given URL is invalid.";
    }

    if(isset($_POST['apiUrl']) && !empty($_POST['apiUrl'])) {
        $apiUrl = $_POST['apiUrl'];
    }
    else {
        echo "Error: URL for given API token in invalid.";
    }

    $project = new RedCapProject($apiUrl, $apiToken, true);
    //Pull field names of the project from REDCap
    $fields = $project->exportFieldNames('json');
} 
catch(PhpCapException $exception) {
    echo $exception->getMessage();
}

echo $fields;

?>