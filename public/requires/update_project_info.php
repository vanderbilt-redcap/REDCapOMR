<?php

session_start();

require_once('../../vendor/autoload.php');
                
use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;

try {

    //Grabs the content from the projects.json file that stores content about created projects
    if(file_exists('..'.DIRECTORY_SEPARATOR.'projects.json')) {
        $projectsJSON = file_get_contents('..'.DIRECTORY_SEPARATOR.'projects.json');
        $json = json_decode($projectsJSON, true);

        //Loop through and find projects that match the project ID from the session
        $i = 0;
        foreach($json as $key => $proj) {
            //Check if the project ID and name are the same as the one being removed
            if($_POST['projId'] == $proj['projId'] && $_POST['projName'] == $proj['projName']) {
                //Change the API token to the (potentially) updated ones given by the user
                if($_POST['newToken'] !== $proj['key']) {
                    $json[$key]['key'] = $_POST['newToken'];
                    
                    //Update session's token value if it changed (keeps session valid)
                    $_SESSION['apiToken'] = $_POST['newToken'];
                }
                //Change the API token to the (potentially) updated ones given by the user
                if($_POST['newUrl'] !== $proj['url']) {
                    $json[$key]['url'] = $_POST['newUrl'];

                    //Update session's URL value if it changed (keeeps session valid)
                    $_SESSION['apiUrl'] = $_POST['newUrl'];

                }
            }
            $i++;
        }

        //Convert the data back to JSON and write it to the file
        //OR create and write the content to the file if it didn't exist
        $newJSON = json_encode($json, JSON_PRETTY_PRINT);
        file_put_contents('..'.DIRECTORY_SEPARATOR.'projects.json', $newJSON);

        echo 'Successfully updated project settings.';
    }
    else {
        echo 'No projects found.  Please successfully create one in \"Select Project\" to use this feature.';
    }
} 
catch(PhpCapException $exception) {
    echo $exception->getMessage();
}

?>