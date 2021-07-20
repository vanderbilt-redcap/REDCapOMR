<?php

require_once('vendor/autoload.php');
require_once("requires/json2latex.php");

use JansenFelipe\SdapsPHP\SdapsPHP;



//Gets the SDAPS project name and parses out the ../
$projectPath = $_POST['instruments'];
$projectPath = str_replace('..'.DIRECTORY_SEPARATOR, '', $projectPath);

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

    
if(sizeof($recordIds) > 0) {
    SdapsPHP::stampIDs($projectPath, $recordIds);
}
else {
    echo "No documents generated.  Enter 1 or more documents to create.\r\n";
}

echo $projectPath;

?>