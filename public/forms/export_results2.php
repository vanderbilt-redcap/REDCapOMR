<html>
<head>
    <link rel="stylesheet" href="../css/styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script type="text/javascript" src="../js/export_results.js"></script>
</head>

<?php require_once('../templates/navbar.php'); ?>

<body>
    <div class="background"></div>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div><p id="loadingText"><br>Exporting results to REDCap...</p>

    <form id="formHeader">
        <p>Enter your project API token:</p>
        <input type="text" id="apiToken" name="apiToken">
        <br>
        <!-- Retrieve this value from host URL when in module, this is temporary -->
        <p>Enter REDCap institution name (from redcap.NAME.edu):</p>
        <input type="text" id="apiUrl" name="apiUrl">
        <br>
        <br>
        <button id="validate" type="button">Validate</button>
        <br>
        <p class="hidden" hidden>Select the instrument used in project:</p>
        <select class="hidden" name="instruments" id="instruments" hidden>
        </select>
        <br>

        <?php 
        // ../tmp/ in Linux file system
        if(file_exists('..'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR)) {
            $directories = glob('..'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR.'*' , GLOB_ONLYDIR);

            echo '<br>
            <div id="runRecognition" class="hidden" hidden>
                  <p>Select a project:</p>
                  <select name="projects" id="projects">
                  <option id="default" hidden selected>Select a project...</option>';

            foreach($directories as $key => $dir) {
                $parsedDir = str_replace('..'.DIRECTORY_SEPARATOR.'tmp'.DIRECTORY_SEPARATOR, '', $dir);
                echo '<option value="'.$dir.'" name="'.$parsedDir.'" id="'.$parsedDir.'">'.$parsedDir.'</option><br><br>';
            }

            echo '</select><br><br>
                  <button id="run" type="button" hidden>Export Results to REDCap</button>
                  <br>
                  <p id="noUploadsText" hidden>No csv data has been generated from recognition for this project.  Do so <a href="run_recognition.php">here</a>.</p>
                  <br>
                  <div class="table-responsive table-body" id="sdapsTable" hidden>
                  </div></form>';
        }
        else {
            echo '<p>No project found.  Create one <a href="create_project.php">here</a>.</p>';
        }
        ?>

    </form>
</body>
</html>