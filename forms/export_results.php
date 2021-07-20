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
        <div id="runRecognition" class="hidden" hidden>
            <p class="hidden" hidden>Select the instrument used in project:</p>
            <select class="hidden" name="instruments" id="instruments" hidden>
            </select>
            <br>
            <br>
            <button id="run" type="button" hidden>Export Results to REDCap</button>
            <br>
            <p id="noUploadsText" hidden>No csv data has been generated from recognition for this project.  Do so <a href="run_recognition.php">here</a>.</p>
            <br>
            <div class="table-responsive table-body" id="sdapsTable" hidden>
        </div>
        </div>
    </form>
</body>
</html>