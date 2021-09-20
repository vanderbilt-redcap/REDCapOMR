<?php session_start(); ?>

<html>
<head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="css/styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>
    <script type="text/javascript" src="js/start_session.js"></script>
    <style>
        .formHeader {
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="formHeader" id="header">
        <h1>REDCap OMR Application</h1>
        <br>
        <div id="buttons">
            <button type="button" id="createBtn" class="btn btn-light">Create New Project</button>
            <button type="button" id="selectBtn" class="btn btn-light">Select Existing Project</button>
        </div>

        <div class="formHeader" id="createForm" hidden>
            <p>Enter your project API token:</p>
            <input type="text" id="apiToken" name="apiToken" value="<?php if(isset($_SESSION['apiToken']) && !empty($_SESSION['apiToken'])) echo $_SESSION['apiToken']; else echo ''; ?>">
            <br>
            <!-- Retrieve this value from host URL when/if in external module, this is for Docker app -->
            <p>Enter REDCap institution name (from redcap.NAME.edu):</p>
            <input type="text" id="apiUrl" name="apiUrl" value="<?php if(isset($_SESSION['apiUrl']) && !empty($_SESSION['apiUrl'])) echo $_SESSION['apiUrl']; else echo ''; ?>">
            <br>
            <br>
            <button type="button" id="validate" class="btn btn-light">Validate</button>
        </div>

        <div class="formHeader" id="selectForm" hidden>
            <p>Select a project to continue with:</p>
            <select name="instruments" id="instruments"></select>
            <br>
            <br>
            <button type="button" id="continue" class="btn btn-light">Continue</button>
        </select>
        </div>
    </div>
</body>
</html>