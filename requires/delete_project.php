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
if(SdapsPHP::deleteProject($project)) {
    echo 'Project ' . $projectDir . ' deleted successfully.  All data for it has been removed.';
}
else {
    echo 'Could not delete project ' . $projectDir . '.  Check the project\'s filepath and try again.';
}

?>