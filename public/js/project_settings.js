$(document).ready(function() {
    let OMR_ProjectVars = {};



    //Validate the credentials entered in the API token/URL fields
    function validateCreds() {
        //Defines global object holding all variables for this project to prevent conflicts
        OMR_ProjectVars.select = document.getElementById('instruments');
        OMR_ProjectVars.form = document.getElementById('formHeader');
        OMR_ProjectVars.instruments = 0;
        OMR_ProjectVars.error = '';

        //Clean up any instrument options from previous validation attempt
        for (i = OMR_ProjectVars.select.length - 1; i >= 0; i--) {
	        OMR_ProjectVars.select.remove(i);
        }
        OMR_ProjectVars.select.length = 0;


        $.ajax({
            type: "POST",
            url: "../requires/get_pid_projects.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val()
            },
            dataType: "JSON",
            success: function(response) {
                
                //If the error variable is filled, alert and log it
                if($.trim(response.error)) {
                    //Hide all elements that shouldn't be visible after error is thrown to client
                    OMR_ProjectVars.settingsDiv = document.getElementById('settingsDiv');
                    OMR_ProjectVars.settingsDiv.setAttribute('hidden', '');

                    OMR_ProjectVars.elements = document.getElementsByClassName('hidden');
                    for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                        OMR_ProjectVars.elements[i].setAttribute('hidden', '');
                    }

                    alert(response.error);
                    console.log(response.error);
                    response.error = '';
                }
                //If we can't trim the response, then it is a blank string (false)
                if(!$.trim(response.results)) {
                    //Hide all elements that shouldn't be visible after getting no response
                    OMR_ProjectVars.settingsDiv = document.getElementById('settingsDiv');
                    OMR_ProjectVars.settingsDiv.setAttribute('hidden', '');

                    OMR_ProjectVars.elements = document.getElementsByClassName('hidden');
                    for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                        OMR_ProjectVars.elements[i].setAttribute('hidden', '');
                    }

                    alert('No projects were found for the project ID of the API token you entered.');
                    console.log('No projects were found for the project ID of the API token you entered.');
                }
                else {
                    //Parse the json result from the php file
                    OMR_ProjectVars.instruments = response.results;

                    OMR_ProjectVars.error = document.getElementById('error');
                    if(OMR_ProjectVars.error) {
                        document.getElementById('error').outerHTML = '';
                    }

                    //Split projects into array ONLY if there are multiple included
                    if(OMR_ProjectVars.instruments.includes(',')) {
                        OMR_ProjectVars.instruments = OMR_ProjectVars.instruments.split(',');

                        for(let i = 0; i < OMR_ProjectVars.instruments.length; i++) {
                            //If we're on the first element, add the default option to the select box
                            if(i == 0) {
                                OMR_ProjectVars.opt = document.createElement('option');
                                OMR_ProjectVars.opt.setAttribute('disabled', '');
                                OMR_ProjectVars.opt.setAttribute('selected', '');
                                OMR_ProjectVars.opt.setAttribute('value', '');
                                OMR_ProjectVars.opt.innerHTML = '-- Select an option --';
                                OMR_ProjectVars.select.appendChild(OMR_ProjectVars.opt);
                            }
    
                            OMR_ProjectVars.opt = document.createElement('option');
                            OMR_ProjectVars.opt.value = OMR_ProjectVars.instruments[i];
                            
                            //Trim the instrument name from the project directory for user readability
                            OMR_ProjectVars.innerInst = OMR_ProjectVars.instruments[i].split('/');
                            OMR_ProjectVars.opt.innerHTML = OMR_ProjectVars.innerInst[OMR_ProjectVars.innerInst.length-1];
                            
                            OMR_ProjectVars.select.appendChild(OMR_ProjectVars.opt);
                        }
                    }
                    else {
                        OMR_ProjectVars.opt = document.createElement('option');
                        OMR_ProjectVars.opt.setAttribute('disabled', '');
                        OMR_ProjectVars.opt.setAttribute('selected', '');
                        OMR_ProjectVars.opt.setAttribute('value', '');
                        OMR_ProjectVars.opt.innerHTML = '-- Select an option --';
                        OMR_ProjectVars.select.appendChild(OMR_ProjectVars.opt);

                        OMR_ProjectVars.opt = document.createElement('option');
                        OMR_ProjectVars.opt.value = OMR_ProjectVars.instruments;
                        
                        //Trim the instrument name from the project directory for user readability
                        OMR_ProjectVars.innerInst = OMR_ProjectVars.instruments.split('/');
                        OMR_ProjectVars.opt.innerHTML = OMR_ProjectVars.innerInst[OMR_ProjectVars.innerInst.length-1];
                        
                        OMR_ProjectVars.select.appendChild(OMR_ProjectVars.opt);
                    }

                    

                    OMR_ProjectVars.elements = document.getElementsByClassName('hidden');
                    for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                        OMR_ProjectVars.elements[i].removeAttribute('hidden');
                    }
                }
            },
            error: function(response) {
                console.log(response);
                console.log("Could not retrieve project information from API key and URL.");

                OMR_ProjectVars.elements = document.getElementsByClassName('hidden');
                for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                    OMR_ProjectVars.elements[i].setAttribute('hidden', '');
                }
                OMR_ProjectVars.settingsDiv = document.getElementById('settingsDiv');
                OMR_ProjectVars.settingsDiv.innerHTML = '';

                if(!$('#error').length) {
                    OMR_ProjectVars.error = document.createElement('h4');
                    OMR_ProjectVars.error.id = 'error';
                    OMR_ProjectVars.error.innerHTML = 'API token is incorrect for the given URL.';
                    OMR_ProjectVars.form.appendChild(OMR_ProjectVars.error);
                }
            }
        });
    }



    //Our session vars filled the two boxes to start, so we automatically validate it
    if($('#apiToken').val() !== '' && $('#apiUrl').val() !== '') {
        $('#validateDiv').attr('hidden', '');
        validateCreds();
    }



    $('#validate').on('click', function () {
        validateCreds();
    });

    $("#instruments").change(function() {
        //Make variable of file upload div
        OMR_ProjectVars.addScans = document.getElementById('settingsDiv');
        //Find the option selected from the instrument list
        OMR_ProjectVars.optionId = $(this).find("option:selected").attr("id");
        
        //Rehide API token/URL change div if it was unhidden
        OMR_ProjectVars.changeInfo = document.getElementById('changeInfo');
        OMR_ProjectVars.changeInfo.setAttribute('hidden', '');

        //If the option ID isn't the default...
        if(!OMR_ProjectVars.optionId == document.getElementById('default')) {
            OMR_ProjectVars.addScans.setAttribute('hidden', '');
        }
        else {
            OMR_ProjectVars.addScans.removeAttribute('hidden');
        }
    });

    
    $('#change').on('click', function() {
        //Display the div to change the project's API token/URL
        OMR_ProjectVars.changeInfo = document.getElementById('changeInfo');
        OMR_ProjectVars.changeInfo.removeAttribute('hidden');
    });

    $('#saveChanges').on('click', function() {

        $.ajax({
            type: "POST",
            url: "../requires/get_session_pid.php",
            success: function(response) {
                if(response != null) {
                    OMR_ProjectVars.projId = response;

                    OMR_ProjectVars.projPath = $('#instruments').val().split("/");
                    OMR_ProjectVars.projName = OMR_ProjectVars.projPath.pop();

                    $.ajax({
                        type: "POST",
                        url: "../requires/update_project_info.php",
                        data: {
                            projName: OMR_ProjectVars.projName,
                            projId: OMR_ProjectVars.projId,
                            newToken: $('#changeToken').val(),
                            newUrl: $('#changeUrl').val()
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
                            alert(response);
                        },
                        error: function(response) {
                            console.log(response);
                            alert(response);
                        }
                    });
                }
                else {
                    console.log('Could not retrieve project\'s REDCap ID from session.  Reselect your project from \"Select Project\" to fix this.');
                    alert('Could not retrieve project\'s REDCap ID from session.  Reselect your project from \"Select Project\" to fix this.');
                }
            },
            error: function(response) {
                console.log(response);
                alert(response);
            }
        });
    });


    $('#reset').on('click', function() {

        $.ajax({
            type: "POST",
            url: "../requires/reset_project.php",
            data: {
                instruments: $('#instruments').val()
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
                alert(response);
            },
            error: function(response) {
                console.log(response);
                alert(response);
            }
        });
    });


    $('#delete').on('click', function() {

        $.ajax({
            type: "POST",
            url: "../requires/delete_project.php",
            data: {
                instruments: $('#instruments').val()
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
                alert(response);
            },
            error: function(response) {
                console.log(response);
                alert(response);
            }
        });
    });
}); 