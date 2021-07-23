<?php

require_once('../vendor/autoload.php');

use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;

try {
    if(isset($_POST['apiToken']) && !empty($_POST['apiToken'])) {
        //Pulls the API token from the project that the user gave in the project creation form
        $apiToken = $_POST['apiToken'];
    }
    else {
        echo 'Could not retrieve API token.';
    }

    if(isset($_POST['apiUrl']) && !empty($_POST['apiUrl'])) {
        //Concats the API url of the user's distribution of REDCap given in the project creation form
        $apiUrl = 'https://redcap.' . strtolower($_POST['apiUrl']) . '.edu/api/';
    }
    else {
        echo 'Could not retrieve API URL from university REDCap domain.';
    }

    //$sslVerify = true;
    $project = new RedCapProject($apiUrl, $apiToken/*, $sslVerify*/);
    $projectInfo = $project->exportProjectInfo('php');
}
catch(PhpCapException $exception) {
    exit($exception->getMessage());
}

//Pull project ID from REDCap project
$pidPath = '../tmp' . DIRECTORY_SEPARATOR . $projectInfo['project_id'] . DIRECTORY_SEPARATOR;

$directories = glob($pidPath.'*', GLOB_ONLYDIR);

if($directories !== false) {
    $directories = implode(',', $directories);
}

echo $directories;

?>