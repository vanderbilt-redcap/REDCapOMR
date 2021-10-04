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
    <div class="background"></div>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div><p id="loadingText"><br>Generating SDAPS project...</p>

    <div class="formHeader" id="header">
        <h1 class="container-fluid bg-light pt-3 pb-3">REDCap OMR Application</h1>
        <br>
        <div id="buttons">
            <button type="button" id="createBtn" class="btn btn-light">Create New Project</button>
            <button type="button" id="selectBtn" class="btn btn-light">Select Existing Project</button>
        </div>

        <div class="formHeader" id="createForm" hidden>
            <p>Enter your project API token:</p>
            <input type="text" id="apiToken" name="apiToken" value="<?php if(isset($_SESSION['apiToken']) && !empty($_SESSION['apiToken'])) echo $_SESSION['apiToken']; else echo ''; ?>">
            <br>
            <!-- Retrieve this value from host URL when in module, this is temporary -->
            <p>Enter entire REDCap API URL (Ex: https://redcap.vanderbilt.edu/api/):</p>
            <input type="text" id="apiUrl" name="apiUrl" value="<?php if(isset($_SESSION['apiUrl']) && !empty($_SESSION['apiUrl'])) echo $_SESSION['apiUrl']; else echo ''; ?>">
            <br>
            <br>
            <button id="validate" class="btn btn-light" type="button">Validate</button>
            <br>
            <br>

            <p class="hidden" hidden>Select instrument to convert to a paper survey and make an SDAPS project from:</p>
            <select class="hidden" name="instruments" id="instruments" hidden>
            </select>
            <br>
            <br>
            <button id="createProject" class="hidden btn btn-light" type="button" hidden>Create Project</button>
        </div>

        <div class="formHeader" id="selectForm" hidden>
            <p>Select an REDCap project to continue with:</p>
            <select name="instrumentsSelect" id="instrumentsSelect">
                <?php
                    $projects = file_get_contents('projects.json');
                    $projects = json_decode($projects, true);

                    //Returns only unique REDCap projects from original JSON file
                    foreach($projects as $k => $v) {
                        foreach($projects as $key => $value) {
                            if($k != $key && $v['projId'] == $value['projId']) {
                                unset($projects[$k]);
                            }
                        }
                    }

                    //Check for length, ignore select if no projects available (maybe in JS?, or create <select> in PHP)
                    foreach($projects as $key => $val) {
                        echo('<option value="'.$val['key'].';'.$val['url'].'">'.'Project: '.$val['rcProjTitle'].', PID: '.$val['projId'].'</option>');
                    }
                ?>
            </select>
            <br>
            <br>
            <button type="button" id="continue" class="btn btn-light">Continue</button>
        </select>
        </div>
    </div>
</body>
</html>