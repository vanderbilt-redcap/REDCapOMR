<?php

require_once('vendor/autoload.php');

use JansenFelipe\SdapsPHP\SdapsPHP;

$projectPath = 'tex';
$filePath = 'example2.tex';

if($projectPath = SdapsPHP::createProject($projectPath, $filePath)) {

    //converting pdf to tif file with built-in SDAPS 'add --convert' function
    SdapsPHP::addConvert($projectPath, 'example-scan.pdf');

    SdapsPHP::recognize($projectPath);

    //Can't tell how/if this will work on non-Linux distributions
    SdapsPHP::gui($projectPath);

    $pathCSV = SdapsPHP::csvExport($projectPath);

    echo '<br>'.$pathCSV;
}

?>