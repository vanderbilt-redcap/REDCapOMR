<?php

//Starts the session so session variables like apiToken and apiUrl can be saved
session_start();

require_once('../../vendor/autoload.php');
                
use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;

if(isset($_POST['apiUrl']) && !empty($_POST['apiUrl']) &&
   isset($_POST['apiToken']) && !empty($_POST['apiToken'])) {

    $_SESSION['apiToken'] = strtoupper($_POST['apiToken']);
    $_SESSION['apiUrl'] = strtolower($_POST['apiUrl']);

    try {
        //Try to create a connection to the REDCap project to prompt a success or error
        $project = new RedCapProject($_SESSION['apiUrl'], $_SESSION['apiToken'], true);

        if(isset($project)) {
            //Set a session variable for the REDCap project's ID if the project exists
            $projectInfo = $project->exportProjectInfo('php');
            $_SESSION['projId'] = $projectInfo['project_id'];

            echo 'true';
        }
    }
    catch(PhpCapException $exception) {
        echo $exception->getMessage();
    }
}
else {
    echo 'The API token or institution name was not entered.  Please try again.';
}

?>
