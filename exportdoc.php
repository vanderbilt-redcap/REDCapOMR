<?php
require_once('vendor/autoload.php'); #Composer include of PHPCap

use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;
use JansenFelipe\SdapsPHP\SdapsPHP;



$apiUrl = 'https://redcap.vanderbilt.edu/api/';
#$apiToken = '41F2B5F19FB3880CAF614FD387C4B5DF';
$apiToken = 'E09E058C6F8F6870E2A031BAFD346A19';
$sslVerify = true;

try {
    $project = new RedCapProject($apiUrl, $apiToken, $sslVerify);
    $records = $project->exportRecords('json');
    $meta = $project->exportMetadata('json', [], ['research_participant_perception_survey_sp']);

    echo '<pre>';
    echo 'Metadata: ' . $meta;
    echo '</pre>'.'<br><br>';

    echo '<pre>';
    echo 'Records: ' . $records;
    echo '</pre>';

} 
catch(PhpCapException $exception) {
    print $exception->getMessage();
}



$data = array(
    'token' => '41F2B5F19FB3880CAF614FD387C4B5DF',
    'content' => 'record',
    'format' => 'json',
    'type' => 'flat',
    'csvDelimiter' => '',
    'rawOrLabel' => 'raw',
    'rawOrLabelHeaders' => 'raw',
    'exportCheckboxLabel' => 'false',
    'exportSurveyFields' => 'false',
    'exportDataAccessGroups' => 'false',
    'returnFormat' => 'json'
);

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_VERBOSE, 0);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data, '', '&'));

$output = curl_exec($ch);
print $output;

curl_close($ch);



$data = array(
    'token' => '1F349E1329A35A85ACE42E11F1AFF022',
    'content' => 'file',
    'action' => 'import',
    'record' => '2',
    'field' => 'file_import',
    'event' => '',
    'returnFormat' => 'csv'
);
$data['file'] = (function_exists('curl_file_create') ? curl_file_create('rpps-u.pdf', 'application/pdf', 'imported.pdf') : "@");

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://redcap.vanderbilt.edu/api/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_VERBOSE, 0);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

$output = curl_exec($ch);
echo "<br>" . "File imported.";

curl_close($ch);

?>