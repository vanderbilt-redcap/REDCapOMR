<?php session_start(); ?>

<html>
<head>
    <link rel="stylesheet" href="../css/styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script type="text/javascript" src="../js/create_printouts.js"></script>
</head>

<?php require_once('../templates/navbar.php'); ?>

<body>
    <div class="background"></div>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div><p id="loadingText"><br>Generating SDAPS project...</p>

    <form id="formHeader">
    <p>Enter your project API token:</p>
        <input type="text" id="apiToken" name="apiToken" value="<?php if(isset($_SESSION['apiToken']) && !empty($_SESSION['apiToken'])) echo $_SESSION['apiToken']; else echo ''; ?>">
        <br>
        <!-- Retrieve this value from host URL when in module, this is temporary -->
        <p>Enter REDCap institution name (from redcap.NAME.edu):</p>
        <input type="text" id="apiUrl" name="apiUrl" value="<?php if(isset($_SESSION['apiUrl']) && !empty($_SESSION['apiUrl'])) echo $_SESSION['apiUrl']; else echo ''; ?>">
        <br>
        <br>
        <button id="validate" type="button">Validate</button>
        <br>
        <p class="hidden" hidden>Select a form with an SDAPS project to make printouts from:</p>
        <select class="hidden" name="instruments" id="instruments" hidden>
        </select>
        <p class="hidden" hidden>Select field name of REDCap project's ID field:</p>
        <select class="hidden" name="fields" id="fields" hidden>
        </select>
        <br>
        <p class="hidden" hidden>Specify which records you want to make printouts of:</p>
        <button id="getRecords" class="hidden" type="button" hidden>Get Records</button>
        <div id="recordsDiv" class="container hidden-inst" hidden>
            <ul id="recordsUl"></ul>
        <br>
    </div>
    <button id="create" type="button" hidden>Create Printouts</button>
    </form>
</body>
</html>