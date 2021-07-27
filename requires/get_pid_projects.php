<?php

require_once('../vendor/autoload.php');

use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;

$json = array();

try {
    if(isset($_POST['apiToken']) && !empty($_POST['apiToken'])) {
        //Pulls the API token from the project that the user gave in the project creation form
        $apiToken = $_POST['apiToken'];
    }
    else {
        $json['error'] = 'Error: Could not retrieve API token.';
        die(json_encode($json));
    }

    if(isset($_POST['apiUrl']) && !empty($_POST['apiUrl'])) {
        //Concats the API url of the user's distribution of REDCap given in the project creation form
        $apiUrl = 'https://redcap.' . strtolower($_POST['apiUrl']) . '.edu/api/';
    }
    else {
        $json['error'] = 'Error: Could not retrieve API URL from university REDCap domain.';
        die(json_encode($json));
    }

    if((isset($_POST['apiToken']) && !empty($_POST['apiToken'])) &&
       (isset($_POST['apiUrl']) && !empty($_POST['apiUrl']))) {
        //$sslVerify = true;
        $project = new RedCapProject($apiUrl, $apiToken/*, $sslVerify*/);
        $projectInfo = $project->exportProjectInfo('php');
    }
    else {
        $json['error'] = 'Error: Could not create connection to REDCap project.  API token or URL given are incorrect.';
        die(json_encode($json));
    }
}
catch(PhpCapException $exception) {
    $json['error'] = $exception->getMessage();
    die(json_encode($json));
}

if(!empty($projectInfo)) {
    //Pull project ID from REDCap project
    $pidPath = '../tmp' . DIRECTORY_SEPARATOR . $projectInfo['project_id'] . DIRECTORY_SEPARATOR;

    //Gets the list of directories inside the PID's filepath
    $directories = glob($pidPath.'*', GLOB_ONLYDIR);

    if($directories !== false) {
        $directories = implode(',', $directories);
    }
    
    $json['results'] = $directories;
    echo json_encode($json);
}
else {
    $json['error'] = 'Error: Could not create connection to REDCap project.  API token or URL given are incorrect.';
    die(json_encode($json));
}

?>