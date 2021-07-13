<html>
<head>
    <link rel="stylesheet" href="../css/styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script type="text/javascript" src="../js/upload_scans.js"></script>
</head>

<?php require_once('../templates/navbar.php'); ?>

<body>
<div class="background"></div>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div><p id="loadingText"><br>Converting and uploading scans...</p>

    <form id="formHeader">
    <?php 

    if(file_exists('../tmp/')) {
        $directories = glob('../tmp/' . '*' , GLOB_ONLYDIR);

        echo '<p>Select a project:</p>
                <form id="form" name="form" enctype="multipart/form-data">
                <select name="projects" id="projects">
                <option id="default" hidden selected>Select a project...</option>';

        foreach($directories as $key => $dir) {
            $parsedDir = str_replace('../tmp/', '', $dir);
            echo '<option value="'.$dir.'" name="'.$parsedDir.'" id="'.$parsedDir.'">'.$parsedDir.'</option><br><br>';
        }

        echo '</select><br>
        <div id="addScans" class="hidden" hidden>
        <br>
        <p style="margin-bottom:10px">Add scanned documents:<br>(Hold Ctrl + Click to select multiple)</p>
        <input name="upload[]" type="file" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" multiple></input>
        <p style="margin-top:10px">(.pdf, .png, .jpg, .jpeg, .tif, .tiff supported)</p>
        <br>
        <button id="upload" type="button">Upload Scans</button>
        </div></form>';
    }
    else {
        echo '<p>No project found.  Create one <a href="create_form.php">here</a>.</p>';
    }
        
    ?>
    </form>
</body>
</html>