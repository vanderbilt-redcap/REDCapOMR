<?php

require_once('vendor/autoload.php');
require_once("requires/json2latex.php");

use JansenFelipe\SdapsPHP\SdapsPHP;
use IU\PHPCap\RedCapProject;
use IU\PHPCap\FileUtil;
use IU\PHPCap\PhpCapException;



    /**
     * Saves the .tex file to the specified directory.
     * If no directory is specified, the file gets saved in the current working directory.
     * Utilizes the /tmp directory for temporary files currently.
     * 
     * @throws Exception
     * @return string filePath
     */
    function saveTex($tex, $filePath = '') {
        if($filePath != '') {
            if(!file_exists($filePath)) {
                mkdir($filePath);
            }
            file_put_contents($filePath.'questionnaire.tex', $tex);
        }
    
        if($filePath != '') {
            file_put_contents('questionnaire.tex', $tex);
        }

        //Return the path to the questionnaire
        return $filePath.'questionnaire.tex';
    }



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

    if(isset($_POST['instruments']) && !empty($_POST['instruments'])) {
        //Pulls the instrument (project) the user selected from the project creation form (create_form.php)
        $formName = $_POST['instruments'];    
    }
    else {
        echo 'Could not retrieve list of instruments from project.';
    }

    //Pulls records IDs of printouts to make from user-checked checkboxes
    $records = array();
    $recordIds = array();
    if(isset($_POST['records']) && !empty($_POST['records'])) {
        //Unserializes the data in the records array sent by create_project.js
        parse_str($_POST['records'], $records);

        //parse_str returns 2-dim array, first dim is the class name of serialized data
        foreach($records as $record) {
            //Run through every ID checked
            foreach($record as $key => $value) {
                //Convert the string IDs to integers
                $recordIds[$key] = (int)$value;
            }
        }
    }

    //Pulls metadata and the list of instruments from the project for the given form
    $meta = $project->exportMetadata('json', [], [$formName]);
    $instruments = $project->exportInstruments('json');
}
catch(PhpCapException $exception) {
    echo $exception->getMessage();
}



//Creates the LaTeX questionnaire of the REDCap data dictionary
$tex = json2latex::createQuestionnaire($meta, $instruments, $_POST['apiUrl']);
//Saves the questionnaire to the /tmp/ dir
$texPath = saveTex($tex, 'tmp'.DIRECTORY_SEPARATOR);

//Gets the user's entered project name in the project creation form
$projName = $_POST['projName'];
//Removes non-alphanumeric characters from file name
$projName = preg_replace('/[^\p{L}\p{N} ]+/', '', $projName);
//Create the project path in the structure of tmp/$projName
$projectPath = 'tmp'.DIRECTORY_SEPARATOR.$projName;


if(($projectPath = SdapsPHP::createProject($projectPath, $texPath)) !== '') {

    //Deletes generated .tex file in tmp/ directory
    unlink($texPath);

    if(sizeof($records) > 0) {
        SdapsPHP::stampIDs($projectPath, $recordIds);
    }
    else {
        echo "You did not create any printouts with your project.  Go to 'Create Printouts' to add them.\r\n";
    }

    $finalOutput = $projectPath . ';' . implode(',', $recordIds);

    //Returns the path of the project to create_project.js
    echo $finalOutput;
}
else {
    echo 'Could not create project directory '. $projectPath . ".  \r\nPlease ensure that all form fields were given proper values.\r\n";
}
?>