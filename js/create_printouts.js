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
                    OMR_ProjectCreateVars.instruments = response;

                    OMR_ProjectCreateVars.error = document.getElementById('error');
                    if(OMR_ProjectCreateVars.error) {
                        console.log(OMR_ProjectCreateVars.error);
                        document.getElementById('error').outerHTML = '';
                    }

                    //Split projects into array ONLY if there are multiple included
                    if(OMR_ProjectCreateVars.instruments.includes(',')) {
                        OMR_ProjectCreateVars.instruments = OMR_ProjectCreateVars.instruments.split(',');

                        for(let i = 0; i < OMR_ProjectCreateVars.instruments.length; i++) {
                            //If we're on the first element, add the default option to the select box
                            if(i == 0) {
                                OMR_ProjectCreateVars.opt = document.createElement('option');
                                OMR_ProjectCreateVars.opt.setAttribute('disabled', '');
                                OMR_ProjectCreateVars.opt.setAttribute('selected', '');
                                OMR_ProjectCreateVars.opt.setAttribute('value', '');
                                OMR_ProjectCreateVars.opt.innerHTML = '-- Select an option --';
                                OMR_ProjectCreateVars.select.appendChild(OMR_ProjectCreateVars.opt);
                            }
    
                            OMR_ProjectCreateVars.opt = document.createElement('option');
                            OMR_ProjectCreateVars.opt.value = OMR_ProjectCreateVars.instruments[i];
                            
                            //Trim the instrument name from the project directory for user readability
                            OMR_ProjectCreateVars.innerInst = OMR_ProjectCreateVars.instruments[i].split('/');
                            OMR_ProjectCreateVars.opt.innerHTML = OMR_ProjectCreateVars.innerInst[OMR_ProjectCreateVars.innerInst.length-1];
                            
                            OMR_ProjectCreateVars.select.appendChild(OMR_ProjectCreateVars.opt);
                        }
                    }
                    else {
                        OMR_ProjectCreateVars.opt = document.createElement('option');
                        OMR_ProjectCreateVars.opt.setAttribute('disabled', '');
                        OMR_ProjectCreateVars.opt.setAttribute('selected', '');
                        OMR_ProjectCreateVars.opt.setAttribute('value', '');
                        OMR_ProjectCreateVars.opt.innerHTML = '-- Select an option --';
                        OMR_ProjectCreateVars.select.appendChild(OMR_ProjectCreateVars.opt);

                        OMR_ProjectCreateVars.opt = document.createElement('option');
                        OMR_ProjectCreateVars.opt.value = OMR_ProjectCreateVars.instruments;
                        
                        //Trim the instrument name from the project directory for user readability
                        OMR_ProjectCreateVars.innerInst = OMR_ProjectCreateVars.instruments.split('/');
                        OMR_ProjectCreateVars.opt.innerHTML = OMR_ProjectCreateVars.innerInst[OMR_ProjectCreateVars.innerInst.length-1];
                        
                        OMR_ProjectCreateVars.select.appendChild(OMR_ProjectCreateVars.opt);
                    }

                    

                    OMR_ProjectCreateVars.elements = document.getElementsByClassName('hidden');
                    for(let i = 0; i < OMR_ProjectCreateVars.elements.length; i++) {
                        OMR_ProjectCreateVars.elements[i].removeAttribute('hidden');
                    }
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
        //Trim directories off of instrument name so records for it can be retrieved from REDCap
        OMR_ProjectCreateVars.projectChosen = $('#instruments').val();
        OMR_ProjectCreateVars.projectChosen = OMR_ProjectCreateVars.projectChosen.split('/');

        $.ajax({
            type: "POST",
            url: "../requires/get_record_ids.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val(),
                instruments: OMR_ProjectCreateVars.projectChosen[OMR_ProjectCreateVars.projectChosen.length-1]
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
            url: "../create_printouts_func.php",
            data: {
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
                OMR_ProjectCreateVars.responseArr = response;
                if(!OMR_ProjectCreateVars.responseArr.includes(';')) {
                    console.log(response);
                    alert(response);
                }
                else {
                    OMR_ProjectCreateVars.responseArr = response.split(';');

                    //Display the message of which records had printouts made for them to the user
                    OMR_ProjectCreateVars.message = OMR_ProjectCreateVars.responseArr[0];
                    console.log(OMR_ProjectCreateVars.message);
                    alert(OMR_ProjectCreateVars.message);

                    //Parse the filepath of the  
                    OMR_ProjectCreateVars.stampedPath = OMR_ProjectCreateVars.responseArr[1];

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

                    //Create scans container
                    OMR_ProjectCreateVars.scansContainer = document.createElement('div');
                    OMR_ProjectCreateVars.scansContainer.id = 'scansContainer';

                    //Creates scans iframe that holds sdaps scans result
                    OMR_ProjectCreateVars.scans = document.createElement('iframe');
                    OMR_ProjectCreateVars.scans.id = 'scans';
                    OMR_ProjectCreateVars.scans.src = OMR_ProjectCreateVars.stampedPath;

                    //Create the download link for the scans
                    OMR_ProjectCreateVars.scansContainer.innerHTML += "<p>Download scans <a href="+OMR_ProjectCreateVars.stampedPath+" download>here.</a></p>";

                    //Add scans container to div container, append scans to it
                    OMR_ProjectCreateVars.iframeContainer.appendChild(OMR_ProjectCreateVars.scansContainer);
                    OMR_ProjectCreateVars.scansContainer.appendChild(OMR_ProjectCreateVars.scans);
                }
            },
            error: function(response) {
                alert(response);
                console.log(response);
            }
        });
    })
});