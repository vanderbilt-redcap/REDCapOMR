$(document).ready(function() {
    let OMR_ProjectVars = {};
    OMR_ProjectVars.createForm = document.getElementById('createForm');
    OMR_ProjectVars.selectForm = document.getElementById('selectForm');
    OMR_ProjectVars.instrumentsSelect = document.getElementById('instruments');


    
    function validateCreds() {
        //Defines global object holding all variables for this project to prevent conflicts
        OMR_ProjectVars.form = document.getElementById('createForm');
        OMR_ProjectVars.instruments = 0;
        OMR_ProjectVars.error = '';
    
        //Clean up any instrument options from previous validation attempt
        for (i = OMR_ProjectVars.instrumentsSelect.length - 1; i >= 0; i--) {
            OMR_ProjectVars.instrumentsSelect.remove(i);
        }
        OMR_ProjectVars.instrumentsSelect.length = 0;
    
    
        $.ajax({
            type: "POST",
            url: "../requires/get_instruments.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val()
            },
            dataType: "JSON",
            success: function(response) {
                //Parse the json result from the php file
                OMR_ProjectVars.instruments = response;
    
                OMR_ProjectVars.error = document.getElementById('error');
                if(OMR_ProjectVars.error) {
                    document.getElementById('error').outerHTML = '';
                }
    
                for(let i = 0; i < OMR_ProjectVars.instruments.length; i++) {
                    OMR_ProjectVars.opt = document.createElement('option');
                    OMR_ProjectVars.opt.value = OMR_ProjectVars.instruments[i]['instrument_name'];
                    OMR_ProjectVars.opt.innerHTML = OMR_ProjectVars.instruments[i]['instrument_name'];
                    OMR_ProjectVars.instrumentsSelect.appendChild(OMR_ProjectVars.opt);
                }
    
                OMR_ProjectVars.elements = document.getElementsByClassName('hidden');
                for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                    OMR_ProjectVars.elements[i].removeAttribute('hidden');
                }
    
            },
            error: function() {
                console.log("Could not retrieve project information from API key and URL.");
    
                OMR_ProjectVars.elements = document.getElementsByClassName('hidden');
                for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                    OMR_ProjectVars.elements[i].setAttribute('hidden', '');
                }
    
                if(!$('#error').length) {
                    OMR_ProjectVars.error = document.createElement('h4');
                    OMR_ProjectVars.error.id = 'error';
                    OMR_ProjectVars.error.innerHTML = 'API token is incorrect for the given URL.';
                    OMR_ProjectVars.form.appendChild(OMR_ProjectVars.error);
                }
            }
        });    
    }



    //Pull up the project creation form, redirect to 'Create Printouts' once done
    $('#createBtn').on('click', function() {
        //Hide the other button's form if this button was pressed
        OMR_ProjectVars.selectForm.setAttribute('hidden', '');
        OMR_ProjectVars.createForm.removeAttribute('hidden');

        //Make button appear active (looking at its form)
        $('#createBtn').addClass('active');
        $('#selectBtn').removeClass('active');
    });



    //Pull up a list of existing projects and allow the user to select one to continue with
    $('#selectBtn').on('click', function() {
        //Hide the other button's form if this button was pressed
        OMR_ProjectVars.createForm.setAttribute('hidden', '');
        OMR_ProjectVars.selectForm.removeAttribute('hidden');

        //Make button appear active (looking at its form)
        $('#selectBtn').addClass('active');
        $('#createBtn').removeClass('active');

        
    });



    $('#validate').on('click', function() {
        validateCreds();
    });



    $('#createProject').on('click', function() {
        $.ajax({
            type: "POST",
            url: "../functions/create_func.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val(),
                instruments: $('#instruments').val(),
                records: $('.records:checked').serialize()
            },
            dataType: "text",
            beforeSend: function() {
                $('.lds-ring').css("display", "flex");
                $('.background').css("display", "flex");
                $('#loadingText').css("display", "flex");
            },
            complete: function() {
                $('.lds-ring').css("display", "none");
                $('.background').css("display", "none");
                $('#loadingText').css("display", "none");
            },
            success: function(response) {
                console.log(response);
                OMR_ProjectVars.response = response;

                //If we can't trim the response, then it is a blank string (false)
                if(!$.trim(response)) {
                    alert('A project for this instrument already exists.');
                    console.log('A project for this instrument already exists.');
                }
                else {
                    //Split the response between the path and the printouts created
                    OMR_ProjectVars.responseArr = OMR_ProjectVars.response.split(';');
    
                    //Get path of questionnaire from response
                    OMR_ProjectVars.newPath = OMR_ProjectVars.responseArr[0];
                    //Parse other possible messages off of the path string
                    OMR_ProjectVars.newPath = OMR_ProjectVars.newPath.substring(OMR_ProjectVars.newPath.indexOf("../"));

    
                    alert("Successfully created project directory " + OMR_ProjectVars.newPath + ".");
                    console.log("Successfully created project directory " + OMR_ProjectVars.newPath + ".");

                    //Redirect the user to the "Create Printouts" page
                    $.ajax({
                        type: 'POST',
                        url: 'public/../requires/start_session.php',
                        data: {
                            apiToken: $('#apiToken').val(),
                            apiUrl: $('#apiUrl').val()
                        },
                        dataType: 'text',
                        success: function(response) {
                            if(response === 'true') {
                                window.location.replace('forms/create_printouts.php');
                            }
                            else {
                                alert("Error: " + response);
                                console.log("Error: " + response);
                            }
                        },
                        error: function(response) {
                            alert("Error: " + response);
                            console.log("Error: " + response);
                        }
                    });
                }

            },
            error: function(response) {
                alert(response);
                console.log(response);
            }
        });
    });


    $('#continue').on('click', function() {
        //Get the URL and the API token from the selected option and split them between the ;
        OMR_ProjectVars.instrumentsSelect = $('#instrumentsSelect').val();
        OMR_ProjectVars.vals = OMR_ProjectVars.instrumentsSelect.split(';');
        OMR_ProjectVars.apiToken = OMR_ProjectVars.vals[0];
        OMR_ProjectVars.apiUrl = OMR_ProjectVars.vals[1];

        //Redirect the user to the "Create Printouts" page
        $.ajax({
            type: 'POST',
            url: 'public/../requires/start_session.php',
            data: {
                apiToken: OMR_ProjectVars.apiToken,
                apiUrl: OMR_ProjectVars.apiUrl
            },
            dataType: 'text',
            success: function(response) {
                if(response === 'true') {
                    window.location.replace('forms/create_printouts.php');
                }
                else {
                    alert("Error: " + response);
                    console.log("Error: " + response);
                }
            },
            error: function(response) {
                alert("Error: " + response);
                console.log("Error: " + response);
            }
        });
    });
});
