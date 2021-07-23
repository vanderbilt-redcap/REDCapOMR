<?php

require_once("../vendor/autoload.php");

use JansenFelipe\SdapsPHP\SdapsPHP;

//Check if instrument was sent in post request
if(isset($_POST['instruments']) && !empty($_POST['instruments'])) {
    //Pulls the project path from instrument that the user wants reset
    $project = $_POST['instruments'];    
}

//Get just the project name from the filepath
$projectDir = explode('/', $project);
$projectDir = $projectDir[sizeof($projectDir)-1];

//Resets the data in the SDAPS project (removes .tif files used for scanning)
if(SdapsPHP::reset($project)) {
    //If the uploads directory exists, delete it
    if(file_exists($project.DIRECTORY_SEPARATOR.'uploads')) {
        SdapsPHP::deleteProject($project.DIRECTORY_SEPARATOR.'uploads');
    }
    //Delete the previous data_1.csv file if it exists
    if(file_exists($project.DIRECTORY_SEPARATOR.'data_1.csv')) {
        SdapsPHP::deleteFile($project.DIRECTORY_SEPARATOR.'data_1.csv');
    }
    //Delete the stamped_*.pdf files if they exist
    foreach(glob($project.DIRECTORY_SEPARATOR.'stamped_*.pdf') as $file) {
        if(file_exists($file)) {
            SdapsPHP::deleteFile($file);
        }
    }
    //Delete the record_printouts.txt file if it exists
    if(file_exists($project.DIRECTORY_SEPARATOR.'record_printouts.txt')) {
        SdapsPHP::deleteFile($project.DIRECTORY_SEPARATOR.'record_printouts.txt');
    }

    echo 'Project ' . $projectDir . ' reset successfully.  All scans, data, and records removed.';
}
else {
    echo 'Could not reset project ' . $projectDir . '.  Check the project\'s filepath and try again.';
}

?>