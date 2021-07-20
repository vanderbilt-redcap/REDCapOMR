$(document).ready(function() {
    let OMR_ProjectCreateVars = {};

    $('#validate').on('click', function () {
        //Defines global object holding all variables for this project to prevent conflicts
        OMR_ProjectCreateVars.select = document.getElementById('instruments');
        OMR_ProjectCreateVars.form = document.getElementById('formHeader');
        OMR_ProjectCreateVars.instruments = 0;
        OMR_ProjectCreateVars.error = '';

        //Clean up any instrument options from previous validation attempt
        for (i = OMR_ProjectCreateVars.select.length - 1; i >= 0; i--) {
	        OMR_ProjectCreateVars.select.remove(i);
        }
        OMR_ProjectCreateVars.select.length = 0;


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
                OMR_ProjectCreateVars.instruments = response;

                OMR_ProjectCreateVars.error = document.getElementById('error');
                if(OMR_ProjectCreateVars.error) {
                    console.log(OMR_ProjectCreateVars.error);
                    document.getElementById('error').outerHTML = '';
                }

                for(let i = 0; i < OMR_ProjectCreateVars.instruments.length; i++) {
                    OMR_ProjectCreateVars.opt = document.createElement('option');
                    OMR_ProjectCreateVars.opt.value = OMR_ProjectCreateVars.instruments[i]['instrument_name'];
                    OMR_ProjectCreateVars.opt.innerHTML = OMR_ProjectCreateVars.instruments[i]['instrument_name'];
                    OMR_ProjectCreateVars.select.appendChild(OMR_ProjectCreateVars.opt);
                }

                OMR_ProjectCreateVars.elements = document.getElementsByClassName('hidden');
                for(let i = 0; i < OMR_ProjectCreateVars.elements.length; i++) {
                    OMR_ProjectCreateVars.elements[i].removeAttribute('hidden');
                }
            },
            error: function() {
                console.log("Could not retrieve project information from API key and URL.");

                OMR_ProjectCreateVars.elements = document.getElementsByClassName('hidden');
                for(let i = 0; i < OMR_ProjectCreateVars.elements.length; i++) {
                    OMR_ProjectCreateVars.elements[i].setAttribute('hidden', '');
                }

                if(!$('#error').length) {
                    OMR_ProjectCreateVars.error = document.createElement('h4');
                    OMR_ProjectCreateVars.error.id = 'error';
                    OMR_ProjectCreateVars.error.innerHTML = 'API token is incorrect for the given URL.';
                    OMR_ProjectCreateVars.form.appendChild(OMR_ProjectCreateVars.error);
                }
            }
        });
    });

    $('#getRecords').on('click', function() {
        $.ajax({
            type: "POST",
            url: "../requires/get_record_ids.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val(),
                instruments: $('#instruments').val()
            },
            dataType: "JSON",
            success: function(response) {
                console.log(response);
                OMR_ProjectCreateVars.records = response;
                OMR_ProjectCreateVars.recordsUl = document.getElementById('recordsUl');

                //Deletes the previous records shown on screen if the "Get Records" button is pressed again
                OMR_ProjectCreateVars.recordsUl.innerHTML = "";

                OMR_ProjectCreateVars.columnAmt = 0;

                OMR_ProjectCreateVars.records.forEach(function(item, index) {
                    //Adds 1 to a variable to make columns for every 10 elements
                    if((index+1) % 10 === 0) {
                        OMR_ProjectCreateVars.columnAmt++;
                    }

                    if(index !== 0) {
                        OMR_ProjectCreateVars.br = document.createElement('br');
                        OMR_ProjectCreateVars.recordsUl.appendChild(OMR_ProjectCreateVars.br);
                    }

                    OMR_ProjectCreateVars.check = document.createElement('input');
                    OMR_ProjectCreateVars.check.type = 'checkbox';
                    OMR_ProjectCreateVars.check.value = item;
                    OMR_ProjectCreateVars.check.id = item;
                    OMR_ProjectCreateVars.check.name = 'records[]';
                    OMR_ProjectCreateVars.check.className = 'records';
                    OMR_ProjectCreateVars.recordsUl.appendChild(OMR_ProjectCreateVars.check);

                    //OMR_ProjectCreateVars.check.setAttribute('disabled', 'disabled');

                    OMR_ProjectCreateVars.label = document.createElement('label');
                    OMR_ProjectCreateVars.label.innerHTML = item;
                    OMR_ProjectCreateVars.recordsUl.appendChild(OMR_ProjectCreateVars.label);
                });

                //Create a new column for every 10 elements
                OMR_ProjectCreateVars.recordsUl.style.columnCount = OMR_ProjectCreateVars.columnAmt;
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
            url: "../create_func.php",
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
                OMR_ProjectCreateVars.response = response;

                //If we can't trim the response, then it is a blank string (false)
                if(!$.trim(response)) {
                    alert('A project for this instrument already exists.');
                    console.log('A project for this instrument already exists.');
                }
                else {
                    //Split the response between the path and the printouts created
                    OMR_ProjectCreateVars.responseArr = OMR_ProjectCreateVars.response.split(';');

                    //Get path of questionnaire from response
                    OMR_ProjectCreateVars.newPath = OMR_ProjectCreateVars.responseArr[0];
                    //Parse other possible messages off of the path string
                    OMR_ProjectCreateVars.newPath = OMR_ProjectCreateVars.newPath.substring(OMR_ProjectCreateVars.newPath.indexOf("tmp/"));

                    //Get array of printouts created
                    OMR_ProjectCreateVars.docNum = OMR_ProjectCreateVars.responseArr[1];

                    //Split projects into array ONLY if there are multiple included
                    if(OMR_ProjectCreateVars.docNum.includes(',')) {
                        OMR_ProjectCreateVars.docNum = OMR_ProjectCreateVars.responseArr[1].split(',');
                    }

                    alert("Successfully created project directory " + OMR_ProjectCreateVars.newPath + ".  \r\nYou can now leave the page.");
                    console.log("Successfully created project directory " + OMR_ProjectCreateVars.newPath + ".  \r\nYou can now leave the page.");

                    try {
                        //Remove the download links/display of previous project if it is displayed
                        document.body.removeChild(OMR_ProjectCreateVars.iframeContainer);
                    }
                    catch(e) {
                        //Do nothing
                    } 

                    //Create a div holding iframes of the questionnaire and stamped files,
                    //along with download links to both
                    OMR_ProjectCreateVars.iframeContainer = document.createElement('div');
                    OMR_ProjectCreateVars.iframeContainer.class = 'container';
                    OMR_ProjectCreateVars.iframeContainer.id = 'iframeContainer';
                    document.body.appendChild(OMR_ProjectCreateVars.iframeContainer);

                    //Creates div and content for questionnaire 
                    OMR_ProjectCreateVars.questionnaireContainer = document.createElement('div');
                    OMR_ProjectCreateVars.questionnaireContainer.id = 'questionnaireContainer';

                    //Creates questionnaire iframe that holds sdaps result
                    OMR_ProjectCreateVars.questionnairePath = '../'+OMR_ProjectCreateVars.newPath+'/questionnaire.pdf';
                    OMR_ProjectCreateVars.questionnaire = document.createElement('iframe');
                    OMR_ProjectCreateVars.questionnaire.id = 'questionnaire';
                    OMR_ProjectCreateVars.questionnaire.src = OMR_ProjectCreateVars.questionnairePath;

                    //Create the download link for the questionnaire
                    OMR_ProjectCreateVars.questionnaireContainer.innerHTML += "<p>Download questionnaire <a href="+OMR_ProjectCreateVars.questionnairePath+" download>here.</a></p>";

                    //Add questionnaire container to div container, append questionnaire to it
                    OMR_ProjectCreateVars.iframeContainer.appendChild(OMR_ProjectCreateVars.questionnaireContainer);
                    OMR_ProjectCreateVars.questionnaireContainer.appendChild(OMR_ProjectCreateVars.questionnaire);

                    //Only show scans if the user specified an amount above 0 
                    if(OMR_ProjectCreateVars.docNum.length > 0) {
                        //Create scans container
                        OMR_ProjectCreateVars.scansContainer = document.createElement('div');
                        OMR_ProjectCreateVars.scansContainer.id = 'scansContainer';

                        //Creates scans iframe that holds sdaps scans result
                        OMR_ProjectCreateVars.scansPath = '../'+OMR_ProjectCreateVars.newPath+'/stamped_1.pdf';
                        OMR_ProjectCreateVars.scans = document.createElement('iframe');
                        OMR_ProjectCreateVars.scans.id = 'scans';
                        OMR_ProjectCreateVars.scans.src = OMR_ProjectCreateVars.scansPath;

                        //Create the download link for the scans
                        OMR_ProjectCreateVars.scansContainer.innerHTML += "<p>Download scans <a href="+OMR_ProjectCreateVars.scansPath+" download>here.</a></p>";

                        //Add scans container to div container, append scans to it
                        OMR_ProjectCreateVars.iframeContainer.appendChild(OMR_ProjectCreateVars.scansContainer);
                        OMR_ProjectCreateVars.scansContainer.appendChild(OMR_ProjectCreateVars.scans);
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