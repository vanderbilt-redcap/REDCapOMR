<?php

require_once('../../vendor/autoload.php');

use JansenFelipe\SdapsPHP\SdapsPHP;


//Check if path to the project exists
if(isset($_POST['projectPath']) && !empty($_POST['projectPath'])) {
    $projectPath = $_POST['projectPath'] . DIRECTORY_SEPARATOR;
    if(!file_exists($projectPath)) {
        echo "Directory does not exist.  Please validate the project name.\r\n";
    }
}

//Check if the path to the /uploads subdirectory exists
if(isset($_POST['uploadPath']) && !empty($_POST['uploadPath'])) {
    $uploadPath = $_POST['uploadPath'] . DIRECTORY_SEPARATOR;
    if(!file_exists($uploadPath)) {
        echo "Project's uploads subdirectory does not exist.\r\n";
    }
}

//Add all the uploads to a variable and convert them to the project's tif file
$uploads = glob($uploadPath.'*');
SdapsPHP::addConvertMult($projectPath, $uploads);

//Run SDAPS's recognition function on the generated tif file
SdapsPHP::recognize($projectPath);

//Call the GUI, commented out since it doesn't work in Docker currently
//SdapsPHP::gui($projectPath);

//Export the CSV results to the project directory
$pathCSV = SdapsPHP::csvExport($projectPath);

?>
