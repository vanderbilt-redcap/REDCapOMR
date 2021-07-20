$(document).ready(function() {
    let OMR_ProjectAnalyzeVars = {};

    $('#validate').on('click', function () {
        //Defines global object holding all variables for this project to prevent conflicts
        OMR_ProjectAnalyzeVars.select = document.getElementById('instruments');
        OMR_ProjectAnalyzeVars.form = document.getElementById('formHeader');
        OMR_ProjectAnalyzeVars.instruments = 0;
        OMR_ProjectAnalyzeVars.error = '';

        //Clean up any instrument options from previous validation attempt
        for (i = OMR_ProjectAnalyzeVars.select.length - 1; i >= 0; i--) {
	        OMR_ProjectAnalyzeVars.select.remove(i);
        }
        OMR_ProjectAnalyzeVars.select.length = 0;


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
                    OMR_ProjectAnalyzeVars.instruments = response;

                    OMR_ProjectAnalyzeVars.error = document.getElementById('error');
                    if(OMR_ProjectAnalyzeVars.error) {
                        console.log(OMR_ProjectAnalyzeVars.error);
                        document.getElementById('error').outerHTML = '';
                    }

                    //Split projects into array ONLY if there are multiple included
                    if(OMR_ProjectAnalyzeVars.instruments.includes(',')) {
                        OMR_ProjectAnalyzeVars.instruments = OMR_ProjectAnalyzeVars.instruments.split(',');

                        for(let i = 0; i < OMR_ProjectAnalyzeVars.instruments.length; i++) {
                            //If we're on the first element, add the default option to the select box
                            if(i == 0) {
                                OMR_ProjectAnalyzeVars.opt = document.createElement('option');
                                OMR_ProjectAnalyzeVars.opt.setAttribute('disabled', '');
                                OMR_ProjectAnalyzeVars.opt.setAttribute('selected', '');
                                OMR_ProjectAnalyzeVars.opt.setAttribute('value', '');
                                OMR_ProjectAnalyzeVars.opt.innerHTML = '-- Select an option --';
                                OMR_ProjectAnalyzeVars.select.appendChild(OMR_ProjectAnalyzeVars.opt);
                            }
    
                            OMR_ProjectAnalyzeVars.opt = document.createElement('option');
                            OMR_ProjectAnalyzeVars.opt.value = OMR_ProjectAnalyzeVars.instruments[i];
                            
                            //Trim the instrument name from the project directory for user readability
                            OMR_ProjectAnalyzeVars.innerInst = OMR_ProjectAnalyzeVars.instruments[i].split('/');
                            OMR_ProjectAnalyzeVars.opt.innerHTML = OMR_ProjectAnalyzeVars.innerInst[OMR_ProjectAnalyzeVars.innerInst.length-1];
                            
                            OMR_ProjectAnalyzeVars.select.appendChild(OMR_ProjectAnalyzeVars.opt);
                        }
                    }
                    else {
                        OMR_ProjectAnalyzeVars.opt = document.createElement('option');
                        OMR_ProjectAnalyzeVars.opt.setAttribute('disabled', '');
                        OMR_ProjectAnalyzeVars.opt.setAttribute('selected', '');
                        OMR_ProjectAnalyzeVars.opt.setAttribute('value', '');
                        OMR_ProjectAnalyzeVars.opt.innerHTML = '-- Select an option --';
                        OMR_ProjectAnalyzeVars.select.appendChild(OMR_ProjectAnalyzeVars.opt);

                        OMR_ProjectAnalyzeVars.opt = document.createElement('option');
                        OMR_ProjectAnalyzeVars.opt.value = OMR_ProjectAnalyzeVars.instruments;
                        
                        //Trim the instrument name from the project directory for user readability
                        OMR_ProjectAnalyzeVars.innerInst = OMR_ProjectAnalyzeVars.instruments.split('/');
                        OMR_ProjectAnalyzeVars.opt.innerHTML = OMR_ProjectAnalyzeVars.innerInst[OMR_ProjectAnalyzeVars.innerInst.length-1];
                        
                        OMR_ProjectAnalyzeVars.select.appendChild(OMR_ProjectAnalyzeVars.opt);
                    }

                    

                    OMR_ProjectAnalyzeVars.elements = document.getElementsByClassName('hidden');
                    for(let i = 0; i < OMR_ProjectAnalyzeVars.elements.length; i++) {
                        OMR_ProjectAnalyzeVars.elements[i].removeAttribute('hidden');
                    }
                }
            },
            error: function() {
                console.log("Could not retrieve project information from API key and URL.");

                OMR_ProjectAnalyzeVars.elements = document.getElementsByClassName('hidden');
                for(let i = 0; i < OMR_ProjectAnalyzeVars.elements.length; i++) {
                    OMR_ProjectAnalyzeVars.elements[i].setAttribute('hidden', '');
                }

                if(!$('#error').length) {
                    OMR_ProjectAnalyzeVars.error = document.createElement('h4');
                    OMR_ProjectAnalyzeVars.error.id = 'error';
                    OMR_ProjectAnalyzeVars.error.innerHTML = 'API token is incorrect for the given URL.';
                    OMR_ProjectAnalyzeVars.form.appendChild(OMR_ProjectAnalyzeVars.error);
                }
            }
        });
    });

    $("#instruments").change(function(){
        OMR_ProjectAnalyzeVars.projectPath = document.getElementById('instruments').value;
        OMR_ProjectAnalyzeVars.uploadPath = OMR_ProjectAnalyzeVars.projectPath + '/uploads';

        console.log(OMR_ProjectAnalyzeVars.uploadPath + ', ' + OMR_ProjectAnalyzeVars.projectPath);
        $.ajax({
            type: "POST", 
            url: "../requires/check_file.php",
            data: {
                uploadPath: OMR_ProjectAnalyzeVars.uploadPath
            },
            dataType: "text",
            success: function(response) {
                OMR_ProjectAnalyzeVars.runRecognition = document.getElementById('runRecognition');
                OMR_ProjectAnalyzeVars.runButton = document.getElementById('run');
                OMR_ProjectAnalyzeVars.noUploads = document.getElementById('noUploadsText');
                OMR_ProjectAnalyzeVars.optionId = $(this).find("option:selected").attr("id");
      
                 if(!OMR_ProjectAnalyzeVars.optionId == document.getElementById('default')) {
                    OMR_ProjectAnalyzeVars.runRecognition.setAttribute('hidden', '');
                }
                else {
                    OMR_ProjectAnalyzeVars.runRecognition.removeAttribute('hidden');
                    if(response == 'true') {
                        OMR_ProjectAnalyzeVars.runButton.removeAttribute('hidden');
                        OMR_ProjectAnalyzeVars.noUploads.setAttribute('hidden', '');
                    }
                    else {
                        OMR_ProjectAnalyzeVars.noUploads.removeAttribute('hidden');
                        OMR_ProjectAnalyzeVars.runButton.setAttribute('hidden', '');
                    }
                }
            },
            error: function() {
                alert('Failed to verify path of uploads folder for project: ' + OMR_ProjectAnalyzeVars.projectPath);
            }
        });
    });

    $('#run').on('click', function() {
        OMR_ProjectAnalyzeVars.projectPath = document.getElementById('instruments').value;
        OMR_ProjectAnalyzeVars.uploadPath = OMR_ProjectAnalyzeVars.projectPath + '/uploads';

        $.ajax({
            type: "POST",
            url: "../analyze_func.php",
            data: {
                projectPath: OMR_ProjectAnalyzeVars.projectPath,
                uploadPath: OMR_ProjectAnalyzeVars.uploadPath
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
                if(!$.trim(response)) {
                    alert('Successfully scanned project.  Go to \'Export Results\' to view these results.');
                    console.log('Successfully scanned project.  Go to \'Export Results\' to view these results.');
                }
                else {
                    alert(response);
                    console.log(response);
                }
                
            },
            error: function(response) {
                if(!$.trim(response)) {
                    alert('Could not fully scan project or display the GUI due to an error.');
                    console.log('Could not fully scan project or display the GUI due to an error.');
                }
                else {
                    alert(response);
                    console.log(response);
                }
            }
        });
    });
});