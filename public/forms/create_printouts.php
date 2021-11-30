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
        <p class="hidden" hidden>Select a form with an SDAPS project to make printouts from:</p>
        <select class="hidden" name="instruments" id="instruments" hidden>
        </select>
        <div class="hidden-inst" hidden>
            <p>Select field name of REDCap project's ID field:</p>
            <select name="fields" id="fields">
            </select>
            <br>
            <p>Specify which records you want to make printouts of:</p>
            <button id="getRecords" type="button" class="btn btn-light">Get Records</button>
        </div>
        <div id="recordsDiv" hidden>
            <div class="verticalScroll tableWrapperVertical">
                <table id="recordsTable" class="table table-bordered table-striped table-responsive"></table>
            </div>
            <input id="checkAll" type="button" class="btn btn-light" value="Check All"/>
        </div>
    <br>
    <br>
    <button id="create" type="button" class="btn btn-primary" hidden>Create Printouts</button>
    </form>
</body>
</html>