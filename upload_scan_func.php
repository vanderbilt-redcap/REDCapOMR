<?php

require_once('vendor/autoload.php');

use JansenFelipe\SdapsPHP\SdapsPHP;

//Create the path to save the uploaded files to
$projectPath = $_POST['instruments'];
$projectPath = str_replace('..'.DIRECTORY_SEPARATOR, '', $projectPath);
$uploadPath = $projectPath . DIRECTORY_SEPARATOR .'uploads' . DIRECTORY_SEPARATOR;

//Create file path to upload files to if it doesn't exist
if(!file_exists($uploadPath)) {
    mkdir($uploadPath);
}

//Declare extensions allowed to upload to server
$allowedExts = array('pdf', 'png', 'jpg', 'jpeg', 'tif', 'tiff');

//Array that holds all new files in /uploads directory
$newUploads = array();
//Used with newUploads to add to array
$i = 0;

//Loop through all the files uploaded to the form
foreach($_FILES['upload']['name'] as $key => $name) {
    //Gets file extension from ech filename to test for correct file type
    $temp = explode('.', $_FILES['upload']['name'][$key]);
    $extension = end($temp);

    //Check MIME types of images to determine if they are of correct type
    //NOTE: upload_max_filesize on my system is 10M, or 1000000 (referenced by size below)
    if (/*(($_FILES['upload']['type'][$key] == 'application/pdf') ||
         ($_FILES['upload']['type'][$key] == 'image/jpg')       || 
         ($_FILES['upload']['type'][$key] == 'image/pjpeg')     || 
         ($_FILES['upload']['type'][$key] == 'image/x-png')     || 
         ($_FILES['upload']['type'][$key] == 'image/png')       || 
         ($_FILES['upload']['type'][$key] == 'image/tiff'))     &&
        */ 
         ($_FILES['upload']['size'][$key] < 10000000)            && 
         in_array($extension, $allowedExts)) 
    {
        if ($_FILES['upload']['error'][$key] > 0) {
            echo "Return Code: " . $_FILES['upload']['error'][$key] . "\r\n";
        } 
        else {

            //Remove whitespace, add increment to identical file names
            $uploadUnspaced = str_replace(' ', '', $_FILES['upload']['name'][$key]);

            if (file_exists($uploadPath . $uploadUnspaced)) {
                echo $uploadUnspaced . " already exists in " . $uploadPath . ".\r\n";
            } 
            else {
                //Adds the new upload to the /uploads directory
                move_uploaded_file($_FILES['upload']['tmp_name'][$key], $uploadPath . $uploadUnspaced);
                
                //Adds that file to the array to be used SDAPS add --convert
                $newUploads[$i] = $uploadPath . $uploadUnspaced;
                $i++;

                echo "Stored in: " . $uploadPath . $uploadUnspaced . "\r\n";
            }
        }
    } 
    else {
        echo "Invalid file: " . $_FILES['upload']['name'][$key] . "\r\n";
    }
}

?>