<?php
require_once('vendor/autoload.php'); #Composer include of PHPCap

use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;
use JansenFelipe\SdapsPHP\SdapsPHP;



$apiUrl = 'https://redcap.vanderbilt.edu/api/';
$apiToken = '41F2B5F19FB3880CAF614FD387C4B5DF';
//$apiToken = 'E09E058C6F8F6870E2A031BAFD346A19';
$sslVerify = true;

try {
    $project = new RedCapProject($apiUrl, $apiToken, $sslVerify);
    $records = $project->exportRecords('json');
    $meta = $project->exportMetadata('json', [], ['research_participant_perception_survey_sp']);
    $projectInfo = $project->exportProjectInfo('php');

    echo '<pre>';
    echo 'Records: ' . $projectInfo['project_id'];
    echo '</pre>';

} 
catch(PhpCapException $exception) {
    print $exception->getMessage();
}


?>