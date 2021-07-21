$(document).ready(function() {
    let OMR_ProjectSettingsVars = {};

    $('#validate').on('click', function () {
        //Defines global object holding all variables for this project to prevent conflicts
        OMR_ProjectSettingsVars.select = document.getElementById('instruments');
        OMR_ProjectSettingsVars.form = document.getElementById('formHeader');
        OMR_ProjectSettingsVars.instruments = 0;
        OMR_ProjectSettingsVars.error = '';

        //Clean up any instrument options from previous validation attempt
        for (i = OMR_ProjectSettingsVars.select.length - 1; i >= 0; i--) {
	        OMR_ProjectSettingsVars.select.remove(i);
        }
        OMR_ProjectSettingsVars.select.length = 0;


        $.ajax({
            type: "POST",
            url: "../requires/get_pid_projects.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val()
            },
            dataType: "text",
            success: function(response) {
                //If we can't trim the response, then it is a blank string (false)
                if(!$.trim(response)) {
                    alert('No projects were found for the project ID of the API token you entered.');
                    console.log('No projects were found for the project ID of the API token you entered.');
                }
                else {
                    //Parse the json result from the php file
                    OMR_ProjectSettingsVars.instruments = response;

                    OMR_ProjectSettingsVars.error = document.getElementById('error');
                    if(OMR_ProjectSettingsVars.error) {
                        console.log(OMR_ProjectSettingsVars.error);
                        document.getElementById('error').outerHTML = '';
                    }

                    //Split projects into array ONLY if there are multiple included
                    if(OMR_ProjectSettingsVars.instruments.includes(',')) {
                        OMR_ProjectSettingsVars.instruments = OMR_ProjectSettingsVars.instruments.split(',');

                        for(let i = 0; i < OMR_ProjectSettingsVars.instruments.length; i++) {
                            //If we're on the first element, add the default option to the select box
                            if(i == 0) {
                                OMR_ProjectSettingsVars.opt = document.createElement('option');
                                OMR_ProjectSettingsVars.opt.setAttribute('disabled', '');
                                OMR_ProjectSettingsVars.opt.setAttribute('selected', '');
                                OMR_ProjectSettingsVars.opt.setAttribute('value', '');
                                OMR_ProjectSettingsVars.opt.innerHTML = '-- Select an option --';
                                OMR_ProjectSettingsVars.select.appendChild(OMR_ProjectSettingsVars.opt);
                            }
    
                            OMR_ProjectSettingsVars.opt = document.createElement('option');
                            OMR_ProjectSettingsVars.opt.value = OMR_ProjectSettingsVars.instruments[i];
                            
                            //Trim the instrument name from the project directory for user readability
                            OMR_ProjectSettingsVars.innerInst = OMR_ProjectSettingsVars.instruments[i].split('/');
                            OMR_ProjectSettingsVars.opt.innerHTML = OMR_ProjectSettingsVars.innerInst[OMR_ProjectSettingsVars.innerInst.length-1];
                            
                            OMR_ProjectSettingsVars.select.appendChild(OMR_ProjectSettingsVars.opt);
                        }
                    }
                    else {
                        OMR_ProjectSettingsVars.opt = document.createElement('option');
                        OMR_ProjectSettingsVars.opt.setAttribute('disabled', '');
                        OMR_ProjectSettingsVars.opt.setAttribute('selected', '');
                        OMR_ProjectSettingsVars.opt.setAttribute('value', '');
                        OMR_ProjectSettingsVars.opt.innerHTML = '-- Select an option --';
                        OMR_ProjectSettingsVars.select.appendChild(OMR_ProjectSettingsVars.opt);

                        OMR_ProjectSettingsVars.opt = document.createElement('option');
                        OMR_ProjectSettingsVars.opt.value = OMR_ProjectSettingsVars.instruments;
                        
                        //Trim the instrument name from the project directory for user readability
                        OMR_ProjectSettingsVars.innerInst = OMR_ProjectSettingsVars.instruments.split('/');
                        OMR_ProjectSettingsVars.opt.innerHTML = OMR_ProjectSettingsVars.innerInst[OMR_ProjectSettingsVars.innerInst.length-1];
                        
                        OMR_ProjectSettingsVars.select.appendChild(OMR_ProjectSettingsVars.opt);
                    }

                    

                    OMR_ProjectSettingsVars.elements = document.getElementsByClassName('hidden');
                    for(let i = 0; i < OMR_ProjectSettingsVars.elements.length; i++) {
                        OMR_ProjectSettingsVars.elements[i].removeAttribute('hidden');
                    }
                }
            },
            error: function() {
                console.log("Could not retrieve project information from API key and URL.");

                OMR_ProjectSettingsVars.elements = document.getElementsByClassName('hidden');
                for(let i = 0; i < OMR_ProjectSettingsVars.elements.length; i++) {
                    OMR_ProjectSettingsVars.elements[i].setAttribute('hidden', '');
                }

                if(!$('#error').length) {
                    OMR_ProjectSettingsVars.error = document.createElement('h4');
                    OMR_ProjectSettingsVars.error.id = 'error';
                    OMR_ProjectSettingsVars.error.innerHTML = 'API token is incorrect for the given URL.';
                    OMR_ProjectSettingsVars.form.appendChild(OMR_ProjectSettingsVars.error);
                }
            }
        });
    });

    $("#instruments").change(function() {
        //Make variable of file upload div
        OMR_ProjectSettingsVars.addScans = document.getElementById('settingsDiv');
        //Find the option selected from the instrument list
        OMR_ProjectSettingsVars.optionId = $(this).find("option:selected").attr("id");
      
        //If the option ID isn't the default...
        if(!OMR_ProjectSettingsVars.optionId == document.getElementById('default')) {
            OMR_ProjectSettingsVars.addScans.setAttribute('hidden', '');
        }
        else {
            OMR_ProjectSettingsVars.addScans.removeAttribute('hidden');
        }
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