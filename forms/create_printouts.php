<html>
<head>
    <link rel="stylesheet" href="../css/styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script type="text/javascript" src="../js/create_project.js"></script>
</head>

<?php require_once('../templates/navbar.php'); ?>

<body>
    <div class="background"></div>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div><p id="loadingText"><br>Generating SDAPS project...</p>

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
        <p class="hidden" hidden>Select instrument to convert to a paper survey:</p>
        <select class="hidden" name="instruments" id="instruments" hidden>
        </select>
        <br>
        <?php 
        // ../tmp/ in the Linux file system
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
                  </form>';
        }
        else {
            echo '<p>No project found.  Create one <a href="create_project.php">here</a>.</p>';
        }
        ?>
        <br>
        <p class="hidden" hidden>Specify number of documents to create (starts from last record ID):</p>
        <input type="text" class="hidden" id="docNum" name="docNum" hidden>
        <br>
        <br>
        <button id="create" class="hidden" type="button" hidden>Create Printouts</button>
    </form>
</body>
</html>