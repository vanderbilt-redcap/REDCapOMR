$(document).ready(function() {
    let OMR_UploadScansVars = {};

    $('#validate').on('click', function () {
        //Defines global object holding all variables for this project to prevent conflicts
        OMR_UploadScansVars.select = document.getElementById('instruments');
        OMR_UploadScansVars.form = document.getElementById('formHeader');
        OMR_UploadScansVars.instruments = 0;
        OMR_UploadScansVars.error = '';

        //Clean up any instrument options from previous validation attempt
        for (i = OMR_UploadScansVars.select.length - 1; i >= 0; i--) {
	        OMR_UploadScansVars.select.remove(i);
        }
        OMR_UploadScansVars.select.length = 0;


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
                    OMR_UploadScansVars.instruments = response;

                    OMR_UploadScansVars.error = document.getElementById('error');
                    if(OMR_UploadScansVars.error) {
                        console.log(OMR_UploadScansVars.error);
                        document.getElementById('error').outerHTML = '';
                    }

                    //Split projects into array ONLY if there are multiple included
                    if(OMR_UploadScansVars.instruments.includes(',')) {
                        OMR_UploadScansVars.instruments = OMR_UploadScansVars.instruments.split(',');

                        for(let i = 0; i < OMR_UploadScansVars.instruments.length; i++) {
                            //If we're on the first element, add the default option to the select box
                            if(i == 0) {
                                OMR_UploadScansVars.opt = document.createElement('option');
                                OMR_UploadScansVars.opt.setAttribute('disabled', '');
                                OMR_UploadScansVars.opt.setAttribute('selected', '');
                                OMR_UploadScansVars.opt.setAttribute('value', '');
                                OMR_UploadScansVars.opt.innerHTML = '-- Select an option --';
                                OMR_UploadScansVars.select.appendChild(OMR_UploadScansVars.opt);
                            }
    
                            OMR_UploadScansVars.opt = document.createElement('option');
                            OMR_UploadScansVars.opt.value = OMR_UploadScansVars.instruments[i];
                            
                            //Trim the instrument name from the project directory for user readability
                            OMR_UploadScansVars.innerInst = OMR_UploadScansVars.instruments[i].split('/');
                            OMR_UploadScansVars.opt.innerHTML = OMR_UploadScansVars.innerInst[OMR_UploadScansVars.innerInst.length-1];
                            
                            OMR_UploadScansVars.select.appendChild(OMR_UploadScansVars.opt);
                        }
                    }
                    else {
                        OMR_UploadScansVars.opt = document.createElement('option');
                        OMR_UploadScansVars.opt.setAttribute('disabled', '');
                        OMR_UploadScansVars.opt.setAttribute('selected', '');
                        OMR_UploadScansVars.opt.setAttribute('value', '');
                        OMR_UploadScansVars.opt.innerHTML = '-- Select an option --';
                        OMR_UploadScansVars.select.appendChild(OMR_UploadScansVars.opt);

                        OMR_UploadScansVars.opt = document.createElement('option');
                        OMR_UploadScansVars.opt.value = OMR_UploadScansVars.instruments;
                        
                        //Trim the instrument name from the project directory for user readability
                        OMR_UploadScansVars.innerInst = OMR_UploadScansVars.instruments.split('/');
                        OMR_UploadScansVars.opt.innerHTML = OMR_UploadScansVars.innerInst[OMR_UploadScansVars.innerInst.length-1];
                        
                        OMR_UploadScansVars.select.appendChild(OMR_UploadScansVars.opt);
                    }

                    

                    OMR_UploadScansVars.elements = document.getElementsByClassName('hidden');
                    for(let i = 0; i < OMR_UploadScansVars.elements.length; i++) {
                        OMR_UploadScansVars.elements[i].removeAttribute('hidden');
                    }
                }
            },
            error: function() {
                console.log("Could not retrieve project information from API key and URL.");

                OMR_UploadScansVars.elements = document.getElementsByClassName('hidden');
                for(let i = 0; i < OMR_UploadScansVars.elements.length; i++) {
                    OMR_UploadScansVars.elements[i].setAttribute('hidden', '');
                }

                if(!$('#error').length) {
                    OMR_UploadScansVars.error = document.createElement('h4');
                    OMR_UploadScansVars.error.id = 'error';
                    OMR_UploadScansVars.error.innerHTML = 'API token is incorrect for the given URL.';
                    OMR_UploadScansVars.form.appendChild(OMR_UploadScansVars.error);
                }
            }
        });
    });

    $("#instruments").change(function() {
        //Make variable of file upload div
        OMR_UploadScansVars.addScans = document.getElementById('addScans');
        //Find the option selected from the instrument list
        OMR_UploadScansVars.optionId = $(this).find("option:selected").attr("id");
      
        //If the option ID isn't the default...
        if(!OMR_UploadScansVars.optionId == document.getElementById('default')) {
            OMR_UploadScansVars.addScans.setAttribute('hidden', '');
        }
        else {
            OMR_UploadScansVars.addScans.removeAttribute('hidden');
        }
    });

    $('#upload').on('click', function() {
        //Create object to hold form data for file uploads
        OMR_UploadScansVars.ajaxData = new FormData($('#form')[0]);
        //Iterate through files and append all to data
        $.each($("input[type=file]"), function(i, obj) {
            $.each(obj.files,function(j, file){
                OMR_UploadScansVars.ajaxData.append('upload['+j+']', file);
            });
        });
        //Add the selected instrument to the form data
        OMR_UploadScansVars.ajaxData.append('instruments', document.getElementById('instruments').value);

        for(let i of OMR_UploadScansVars.ajaxData) {
            console.log(i);
        }

        $.ajax({
            type: "POST",
            url: "../upload_scan_func.php",
            data: OMR_UploadScansVars.ajaxData,
            dataType: "text",
            processData: false,
            contentType: false,
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