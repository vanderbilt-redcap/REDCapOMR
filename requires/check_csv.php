<?php

if(isset($_POST['projectPath']) && !empty($_POST['projectPath'])) {
    if(file_exists($_POST['projectPath'])) {
        if(count(glob($_POST['projectPath'].'/*.csv')) === 0) {
            echo 'false';
        }
        else {
            echo 'true';
        }
    }
    else {
        echo 'false';
    }

}

?>