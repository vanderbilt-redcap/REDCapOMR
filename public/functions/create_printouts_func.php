<?php

require_once('../../vendor/autoload.php');

use JansenFelipe\SdapsPHP\SdapsPHP;



//Gets the SDAPS project name and parses out the ../
$projectPath = $_POST['instruments'];

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

//Only stamp printouts with record IDs if we have more than one
if(sizeof($recordIds) > 0) {
    //Stamp the records
    SdapsPHP::stampIDs($projectPath, $recordIds);

    //Returns the list of stamped_x.pdf documents for this project
    $stampedDocs = glob($projectPath.DIRECTORY_SEPARATOR.'stamped_*.pdf');

    //Create a file to hold the list of records that have printouts associated with them
    if(!file_exists($projectPath.DIRECTORY_SEPARATOR.'record_printouts.txt')) {
        $printoutFile = fopen($projectPath.DIRECTORY_SEPARATOR.'record_printouts.txt', 'w+');
    }
    else {
        $printoutFile = fopen($projectPath.DIRECTORY_SEPARATOR.'record_printouts.txt', 'a+');
    }

    //Create the message output echoed by js and write content to the printout file
    echo 'Created printouts for records:';
    foreach($recordIds as $key => $id) {
        //Write the row of record ID and filepath to the file
        fwrite($printoutFile, $id.';'.$stampedDocs[sizeof($stampedDocs)-1]."\r\n");

        if($key === (sizeof($recordIds)-1)) {
            //Add semicolon since data after it will be parsed as iframe filepath
            echo ' '.$id.".;";
        }
        else {
            echo ' '.$id.',';
        }
    }
    fclose($printoutFile);

    //Echoes the path to the new printout generated by the user
    //Note: Took out the '..'.DIRECTORY_SEPARATOR in Docker, as it dereferenced the /public directory
    echo $stampedDocs[sizeof($stampedDocs)-1];
}
//If we don't have any documents to generate
else {
    echo "No documents generated.  Select 1 or more records to create printouts for.\r\n";
}

?>
