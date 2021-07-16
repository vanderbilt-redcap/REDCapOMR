<html>
<head>
    <link rel="stylesheet" href="../css/styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script type="text/javascript" src="../js/create_project2.js"></script>
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
        <p class="hidden" hidden>Enter an SDAPS project name:</p>
        <input type="text" class="hidden" id="projName" name="projName" hidden>
        <br>
        <p class="hidden" hidden>Specify number of documents to create (starts from last record ID):</p>
        <input type="text" class="hidden" id="docNum" name="docNum" hidden>
        <br>
        <br>
        <button id="create" class="hidden" type="button" hidden>Create Form</button>
    </form>
</body>
</html>