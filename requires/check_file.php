<?php

if(isset($_POST['uploadPath']) && !empty($_POST['uploadPath'])) {
    if(file_exists($_POST['uploadPath'])) {
        echo 'true';
    }
    else {
        echo 'false';
    }

}

?>