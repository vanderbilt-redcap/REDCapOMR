$(document).ready(function() {
    let OMR_ProjectVars = {};



    //Validate the credentials entered in the API token/URL fields
    function validateCreds() {
        //Defines global object holding all variables for this project to prevent conflicts
        OMR_ProjectVars.instrumentsSelect = document.getElementById('instruments');
        OMR_ProjectVars.fieldsSelect = document.getElementById('fields');
        OMR_ProjectVars.form = document.getElementById('formHeader');
        OMR_ProjectVars.instruments = 0;
        OMR_ProjectVars.fields = 0;
        OMR_ProjectVars.error = '';

        //Clean up any instrument options from previous validation attempt
        for (i = OMR_ProjectVars.instrumentsSelect.length - 1; i >= 0; i--) {
	        OMR_ProjectVars.instrumentsSelect.remove(i);
        }
        OMR_ProjectVars.instrumentsSelect.length = 0;

        //Clean up any field name options from previous validation attempt
        for (i = OMR_ProjectVars.fieldsSelect.length - 1; i >= 0; i--) {
	        OMR_ProjectVars.fieldsSelect.remove(i);
        }
        OMR_ProjectVars.fieldsSelect.length = 0;


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


        $.ajax({
            type: "POST",
            url: "../requires/get_field_names.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val()
            },
            dataType: "JSON",
            success: function(response) {
                //Parse the json result from the php file
                OMR_ProjectVars.fields = response;

                OMR_ProjectVars.error = document.getElementById('error');
                if(OMR_ProjectVars.error) {
                    document.getElementById('error').outerHTML = '';
                }

                for(let i = 0; i < OMR_ProjectVars.fields.length; i++) {
                    OMR_ProjectVars.opt = document.createElement('option');
                    OMR_ProjectVars.opt.value = OMR_ProjectVars.fields[i]['original_field_name'];
                    OMR_ProjectVars.opt.innerHTML = OMR_ProjectVars.fields[i]['original_field_name'];
                    OMR_ProjectVars.fieldsSelect.appendChild(OMR_ProjectVars.opt);
                }

                OMR_ProjectVars.elements = document.getElementsByClassName('hidden');
                for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                    OMR_ProjectVars.elements[i].removeAttribute('hidden');
                }
            },
            error: function() {
                console.log("Could not retrieve project field names from API key and URL.");

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



    //Our session vars filled the two boxes to start, so we automatically validate it
    if($('#apiToken').val() !== '' && $('#apiUrl').val() !== '') {
        $('#validateDiv').attr('hidden', '');
        validateCreds();
    }



    $('#validate').on('click', function () {
        validateCreds();
    });


    
    $('#getRecords').on('click', function() {
        //Trim directories off of instrument name so records for it can be retrieved from REDCap
        OMR_ProjectVars.projectChosen = $('#instruments').val();  
        OMR_ProjectVars.projectChosen = OMR_ProjectVars.projectChosen.split('/');

        $.ajax({
            type: "POST",
            url: "../requires/get_record_ids.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val(),
                instruments: OMR_ProjectVars.projectChosen[OMR_ProjectVars.projectChosen.length-1],
                fieldName: $('#fields').val()
            },
            dataType: "JSON",
            success: function(response) {
                //If we can't trim the response, then it is a blank string (false)
                if(!$.trim(response)) {
                    //Hide all elements that shouldn't be visible after getting no response
                    OMR_ProjectVars.recordsDiv = document.getElementById('recordsDiv');
                    OMR_ProjectVars.recordsDiv.setAttribute('hidden', '');

                    OMR_ProjectVars.elements = document.getElementsByClassName('hidden');
                    for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                        OMR_ProjectVars.elements[i].setAttribute('hidden', '');
                    }

                    alert('No projects were found for the project ID of the API token you entered.');
                    console.log('No projects were found for the project ID of the API token you entered.');
                }
                //If the error variable is filled, alert and log it
                else if($.trim(response.error)) {
                    //Hide all elements that shouldn't be visible after error is thrown to client
                    OMR_ProjectVars.recordsDiv = document.getElementById('recordsDiv');
                    OMR_ProjectVars.recordsDiv.setAttribute('hidden', '');

                    OMR_ProjectVars.elements = document.getElementsByClassName('hidden');
                    for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                        OMR_ProjectVars.elements[i].setAttribute('hidden', '');
                    }

                    alert(response.error);
                    console.log(response.error);
                    response.error = '';
                }
                else {
                OMR_ProjectVars.records = response.results;
                OMR_ProjectVars.recordsUl = document.getElementById('recordsUl');

                //Deletes the previous records shown on screen if the "Get Records" button is pressed again
                OMR_ProjectVars.recordsUl.innerHTML = "";

                OMR_ProjectVars.columnAmt = 0;

                OMR_ProjectVars.records.forEach(function(item, index) {
                    //Checks if index is divisible by 10 to make columns for every 10 elements
                    if((index+1) % 10 === 0) {
                        OMR_ProjectVars.columnAmt++;
                    }

                    if(index !== 0) {
                        OMR_ProjectVars.br = document.createElement('br');
                        OMR_ProjectVars.recordsUl.appendChild(OMR_ProjectVars.br);
                    }

                    OMR_ProjectVars.check = document.createElement('input');
                    OMR_ProjectVars.check.type = 'checkbox';
                    OMR_ProjectVars.check.value = item;
                    OMR_ProjectVars.check.id = item;
                    OMR_ProjectVars.check.name = 'records[]';
                    OMR_ProjectVars.check.className = 'records';
                    OMR_ProjectVars.recordsUl.appendChild(OMR_ProjectVars.check);

                    //OMR_ProjectVars.check.setAttribute('disabled', 'disabled');

                    OMR_ProjectVars.label = document.createElement('label');
                    OMR_ProjectVars.label.innerHTML = item;
                    OMR_ProjectVars.recordsUl.appendChild(OMR_ProjectVars.label);
                });

                //Create a new column for every 10 elements
                OMR_ProjectVars.recordsUl.style.columnCount = OMR_ProjectVars.columnAmt;
                }
            },
            error: function(response) {
                alert(response);
                console.log(response);
            }
        });
    });

    $('#create').on('click', function() {
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

                    //Get array of printouts created
                    OMR_ProjectVars.docNum = OMR_ProjectVars.responseArr[1];

                    //Split projects into array ONLY if there are multiple included
                    if(OMR_ProjectVars.docNum.includes(',')) {
                        OMR_ProjectVars.docNum = OMR_ProjectVars.responseArr[1].split(',');
                    }

                    alert("Successfully created project directory " + OMR_ProjectVars.newPath + ".  \r\nYou can now leave the page.");
                    console.log("Successfully created project directory " + OMR_ProjectVars.newPath + ".  \r\nYou can now leave the page.");

                    try {
                        //Remove the download links/display of previous project if it is displayed
                        document.body.removeChild(OMR_ProjectVars.iframeContainer);
                    }
                    catch(e) {
                        //Do nothing
                    } 

                    //Create a div holding iframes of the questionnaire and stamped files,
                    //along with download links to both
                    OMR_ProjectVars.iframeContainer = document.createElement('div');
                    OMR_ProjectVars.iframeContainer.class = 'container';
                    OMR_ProjectVars.iframeContainer.id = 'iframeContainer';
                    document.body.appendChild(OMR_ProjectVars.iframeContainer);

                    //Creates div and content for questionnaire 
                    OMR_ProjectVars.questionnaireContainer = document.createElement('div');
                    OMR_ProjectVars.questionnaireContainer.id = 'questionnaireContainer';

                    //Creates questionnaire iframe that holds sdaps result
                    OMR_ProjectVars.questionnairePath = OMR_ProjectVars.newPath+'/questionnaire.pdf';
                    OMR_ProjectVars.questionnaire = document.createElement('iframe');
                    OMR_ProjectVars.questionnaire.id = 'questionnaire';
                    OMR_ProjectVars.questionnaire.src = OMR_ProjectVars.questionnairePath;

                    //Create the download link for the questionnaire
                    OMR_ProjectVars.questionnaireContainer.innerHTML += "<p>Download questionnaire <a href="+OMR_ProjectVars.questionnairePath+" download>here.</a></p>";

                    //Add questionnaire container to div container, append questionnaire to it
                    OMR_ProjectVars.iframeContainer.appendChild(OMR_ProjectVars.questionnaireContainer);
                    OMR_ProjectVars.questionnaireContainer.appendChild(OMR_ProjectVars.questionnaire);

                    //Only show scans if the user specified an amount above 0 
                    if(OMR_ProjectVars.docNum.length > 0) {
                        //Create scans container
                        OMR_ProjectVars.scansContainer = document.createElement('div');
                        OMR_ProjectVars.scansContainer.id = 'scansContainer';

                        //Creates scans iframe that holds sdaps scans result
                        OMR_ProjectVars.scansPath = OMR_ProjectVars.newPath+'/stamped_1.pdf';
                        OMR_ProjectVars.scans = document.createElement('iframe');
                        OMR_ProjectVars.scans.id = 'scans';
                        OMR_ProjectVars.scans.src = OMR_ProjectVars.scansPath;

                        //Create the download link for the scans
                        OMR_ProjectVars.scansContainer.innerHTML += "<p>Download scans <a href="+OMR_ProjectVars.scansPath+" download>here.</a></p>";

                        //Add scans container to div container, append scans to it
                        OMR_ProjectVars.iframeContainer.appendChild(OMR_ProjectVars.scansContainer);
                        OMR_ProjectVars.scansContainer.appendChild(OMR_ProjectVars.scans);
                    }
                }

            },
            error: function(response) {
                alert(response);
                console.log(response);
            }
        });
    })
});