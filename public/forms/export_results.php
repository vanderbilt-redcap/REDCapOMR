<?php session_start(); ?>

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
        <div id="validateDiv">
            <p>Enter your project API token:</p>
            <input type="text" id="apiToken" name="apiToken" value="<?php if(isset($_SESSION['apiToken']) && !empty($_SESSION['apiToken'])) echo $_SESSION['apiToken']; else echo ''; ?>">
            <br>
            <!-- Retrieve this value from host URL when in module, this is temporary -->
            <p>Enter REDCap institution name (from redcap.NAME.edu):</p>
            <input type="text" id="apiUrl" name="apiUrl" value="<?php if(isset($_SESSION['apiUrl']) && !empty($_SESSION['apiUrl'])) echo $_SESSION['apiUrl']; else echo ''; ?>">
            <br>
            <br>
            <button id="validate" class="btn btn-light" type="button">Validate</button>
            <br>
        </div>
        <div id="exportDiv" class="hidden" hidden>
            <p class="hidden" hidden>Select the instrument used in project:</p>
            <select class="hidden" name="instruments" id="instruments" hidden>
            </select>
            <br>
            <p class="hidden" hidden>Select field name of REDCap project's ID field:</p>
            <select class="hidden" name="fields" id="fields" hidden>
            </select>
            <br>
            <button id="run" type="button" class="btn btn-light" hidden>Export Results to REDCap</button>
            <br>
            <p id="noUploadsText" hidden>No csv data has been generated from recognition for this project.  Do so <a href="run_recognition.php">here</a>.</p>
            <br>
            <div class="table-responsive table-body" id="sdapsTable" hidden>
        </div>
        </div>
    </form>
</body>
</html>