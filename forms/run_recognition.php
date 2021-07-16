<html>
<head>
    <link rel="stylesheet" href="../css/styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script type="text/javascript" src="../js/run_recognition.js"></script>
</head>

<?php require_once('../templates/navbar.php'); ?>

<body>
    <div class="background"></div>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    <p id="loadingText"><br>Recognizing scans with SDAPS...</p>

    <form id="formHeader">
    <?php 
    // ../tmp/ in Linux file system
    if(file_exists('..'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR)) {
        $directories = glob('..'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR.'*' , GLOB_ONLYDIR);

        echo '<p>Select a project:</p>
                <form id="form">
                <select name="projects" id="projects">
                <option id="default" hidden selected>Select a project...</option>';

        foreach($directories as $key => $dir) {
            $parsedDir = str_replace('..'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR, '', $dir);
            echo '<option value="'.$dir.'" name="'.$parsedDir.'" id="'.$parsedDir.'">'.$parsedDir.'</option><br><br>';
        }

        echo '</select><br><br>
        <div id="runRecognition" class="hidden" hidden>
        <button id="run" type="button" hidden>Run Recognition</button>
        <p id="noUploadsText" hidden>No uploads directory found for project.  Upload scanned files <a href="upload_scans.php">here</a>.</p>
        </div></form>';
    }
    else {
        echo '<p>No project found.  Create one <a href="create_project.php">here</a>.</p>';
    }
        
    ?>
    </form>
</body>
</html>