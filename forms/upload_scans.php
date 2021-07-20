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
        <p class="hidden" hidden>Select a form with an SDAPS project to upload printouts to:</p>
        <select class="hidden" name="instruments" id="instruments" hidden>
        </select>
        <br>
        <div id="addScans" class="hidden-inst" hidden>
            <br>
            <p style="margin-bottom:10px">Add scanned documents:<br>(Hold Ctrl + Click to select multiple)</p>
            <input name="upload[]" type="file" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" multiple></input>
            <p style="margin-top:10px">(.pdf, .png, .jpg, .jpeg, .tif, .tiff supported)</p>
            <br>
            <button id="upload" type="button">Upload Scans</button>
        </div>
    </form>
</body>
</html>