<?php

require_once("../../vendor/autoload.php");

use JansenFelipe\SdapsPHP\SdapsPHP;

//Check if instrument was sent in post request
if(isset($_POST['instruments']) && !empty($_POST['instruments'])) {
    //Pulls the project path from instrument that the user wants reset
    $project = $_POST['instruments'];    
}

//Get just the project name from the filepath
$projectDir = explode('/', $project);
$projectId = $projectDir[sizeof($projectDir)-2];
$projectDir = $projectDir[sizeof($projectDir)-1];



//Remove the project's entry from projects.json
$projectsJSON = file_get_contents('..'.DIRECTORY_SEPARATOR.'projects.json');
$projectsJSON = json_decode($projectsJSON, true);

$i=0;
foreach($projectsJSON as $proj) {
    //check the property of every element
    if($projectId == $proj['projId'] && $projectDir == $proj['projName']){
        unset($projectsJSON[$i]);
   }
   $i++;
}

//Convert the data back to JSON and write it to the file
$newJSON = json_encode($projectsJSON, JSON_PRETTY_PRINT);
file_put_contents('..'.DIRECTORY_SEPARATOR.'projects.json', $newJSON);



//Resets the data in the SDAPS project (removes .tif files used for scanning)
if(SdapsPHP::deleteProject($project)) {
    echo 'Project ' . $projectDir . ' deleted successfully.  All data for it has been removed.';
}
else {
    echo 'Could not delete project ' . $projectDir . '.  Check the project\'s filepath and try again.';
}

?>