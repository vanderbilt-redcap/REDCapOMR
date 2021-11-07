<?php session_start(); ?>

<html>
<head>
    <link rel="stylesheet" href="../css/styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script type="text/javascript" src="../js/project_settings.js"></script>
</head>

<?php require_once('../templates/navbar.php'); ?>

<body>
<div class="background"></div>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div><p id="loadingText"><br>Updating project...</p>

    <form id="formHeader">
        <div id="validateDiv">
            <p>Enter your project API token:</p>
            <input type="text" id="apiToken" name="apiToken" value="<?php if(isset($_SESSION['apiToken']) && !empty($_SESSION['apiToken'])) echo $_SESSION['apiToken']; else echo ''; ?>">
            <br>
            <!-- Retrieve this value from host URL when in module, this is temporary -->
            <p>Enter entire REDCap API URL (Ex: https://redcap.vanderbilt.edu/api/):</p>
            <input type="text" id="apiUrl" name="apiUrl" value="<?php if(isset($_SESSION['apiUrl']) && !empty($_SESSION['apiUrl'])) echo $_SESSION['apiUrl']; else echo ''; ?>">
            <br>
            <br>
            <button id="validate" type="button" class="btn btn-light">Validate</button>
            <br>
        </div>
        <p class="hidden" hidden>Select SDAPS project to change settings on:</p>
        <select class="hidden" name="instruments" id="instruments" hidden>
        </select>
        <br>
        <div class="hidden-inst" id="settingsDiv" hidden>
            <br>
            <p>Select an option for the project:</p>
            <button id="change" type="button" class="btn btn-info">Change API Token/URL</button>
            <button id="reset" type="button" class="btn btn-warning">Reset</button>
            <button id="delete" type="button" class="btn btn-danger">Delete</button>
        </div>
        <div id="changeInfo" hidden>
            <br>
            <h5>Note: don't edit fields you want left unchanged</h5>
            <p>Enter your new project API token:</p>
            <input type="text" id="changeToken" name="changeToken" value="<?php if(isset($_SESSION['apiToken']) && !empty($_SESSION['apiToken'])) echo $_SESSION['apiToken']; else echo ''; ?>">
            <br>
            <!-- Retrieve this value from host URL when in module, this is temporary -->
            <p>Enter new REDCap API URL (Ex: https://redcap.vanderbilt.edu/api/):</p>
            <input type="text" id="changeUrl" name="changeUrl" style="width: 300px;" value="<?php if(isset($_SESSION['apiUrl']) && !empty($_SESSION['apiUrl'])) echo $_SESSION['apiUrl']; else echo ''; ?>">
            <br>
            <br>
            <button id="saveChanges" type="button" class="btn btn-primary">Save Changes</button>
        </div>
    </form>
</body>
</html>