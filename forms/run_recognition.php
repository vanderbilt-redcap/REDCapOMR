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
        <p class="hidden" hidden>Select a form with an SDAPS project to run recognition on:</p>
        <select class="hidden" name="instruments" id="instruments" hidden>
        </select>
        <br>
        <div id="runRecognition" class="hidden" hidden>
            <button id="run" type="button" hidden>Run Recognition</button>
            <p id="noUploadsText" hidden>No uploads directory found for project.  Upload scanned files <a href="upload_scans.php">here</a>.</p>
        </div>
    </form>
</body>
</html>