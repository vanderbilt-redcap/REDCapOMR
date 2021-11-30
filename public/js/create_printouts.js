$(document).ready(function() {
    let OMR_ProjectVars = {};



    function validateCreds() {
        //Defines global object holding all variables for this project to prevent conflicts
        OMR_ProjectVars.instrumentsSelect = document.getElementById('instruments');
        OMR_ProjectVars.fieldsSelect = document.getElementById('fields');
        OMR_ProjectVars.form = document.getElementById('formHeader');
        OMR_ProjectVars.instruments = 0;
        OMR_ProjectVars.fields = 0;
        OMR_ProjectVars.error = '';

        //Hide check all, uncheck all, and create buttons if we click validate again
        OMR_ProjectVars.createBtn = document.getElementById('create');
        OMR_ProjectVars.createBtn.setAttribute('hidden', '');

        OMR_ProjectVars.checkAll = document.getElementById('checkAll');
        OMR_ProjectVars.checkAll.setAttribute('hidden', '');


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
            url: "../requires/get_pid_projects.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val()
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
                    //Parse the json result from the php file
                    OMR_ProjectVars.results = response;
                    OMR_ProjectVars.instruments = OMR_ProjectVars.results.results;

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
                                OMR_ProjectVars.instrumentsSelect.appendChild(OMR_ProjectVars.opt);
                            }
    
                            OMR_ProjectVars.opt = document.createElement('option');
                            OMR_ProjectVars.opt.value = OMR_ProjectVars.instruments[i];
                            
                            //Trim the instrument name from the project directory for user readability
                            OMR_ProjectVars.innerInst = OMR_ProjectVars.instruments[i].split('/');
                            OMR_ProjectVars.opt.innerHTML = OMR_ProjectVars.innerInst[OMR_ProjectVars.innerInst.length-1];
                            
                            OMR_ProjectVars.instrumentsSelect.appendChild(OMR_ProjectVars.opt);
                        }
                    }
                    else {
                        OMR_ProjectVars.opt = document.createElement('option');
                        OMR_ProjectVars.opt.setAttribute('disabled', '');
                        OMR_ProjectVars.opt.setAttribute('selected', '');
                        OMR_ProjectVars.opt.setAttribute('value', '');
                        OMR_ProjectVars.opt.innerHTML = '-- Select an option --';
                        OMR_ProjectVars.instrumentsSelect.appendChild(OMR_ProjectVars.opt);

                        OMR_ProjectVars.opt = document.createElement('option');
                        OMR_ProjectVars.opt.value = OMR_ProjectVars.instruments;
                        
                        //Trim the instrument name from the project directory for user readability
                        OMR_ProjectVars.innerInst = OMR_ProjectVars.instruments.split('/');
                        OMR_ProjectVars.opt.innerHTML = OMR_ProjectVars.innerInst[OMR_ProjectVars.innerInst.length-1];
                        
                        OMR_ProjectVars.instrumentsSelect.appendChild(OMR_ProjectVars.opt);
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
                OMR_ProjectVars.recordsDiv = document.getElementById('recordsDiv');
                OMR_ProjectVars.recordsDiv.innerHTML = '';

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


    
    $("#instruments").change(function() {
    
        $.ajax({
            type: 'POST',
            url: '../requires/check_file.php',
            data: {
                uploadPath: $('#instruments').val()
            },
            dataType: 'text',
            success: function(response) {
                if(response === 'true') {
                    //Unhides all content that must come after a valid
                    OMR_ProjectVars.elements = document.getElementsByClassName('hidden-inst');
                    for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                        OMR_ProjectVars.elements[i].removeAttribute('hidden');
                    }
                }
                else {
                    alert('The currently selected instrument could not be validated in the file system.  Please make sure it is correct.');
                    console.log('The currently selected instrument could not be validated in the file system.  Please make sure it is correct.');

                    OMR_ProjectVars.elements = document.getElementsByClassName('hidden-inst');
                    for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                        OMR_ProjectVars.elements[i].setAttribute('hidden', '');
                    }
                }
            },
            error: function() {
                alert('There was an error validating if the project exists.');
                console.log('There was an error validating if the project exists.');
            
                OMR_ProjectVars.elements = document.getElementsByClassName('hidden-inst');
                for(let i = 0; i < OMR_ProjectVars.elements.length; i++) {
                    OMR_ProjectVars.elements[i].setAttribute('hidden', '');
                }
            }
        });
    });


    $('#getRecords').on('click', function() {

        //Hide check all, uncheck all, and create button before records are retrieved in case of error
        OMR_ProjectVars.createBtn = document.getElementById('create');
        OMR_ProjectVars.createBtn.setAttribute('hidden', '');

        OMR_ProjectVars.recordsDiv = document.getElementById('recordsDiv');
        OMR_ProjectVars.recordsDiv.setAttribute('hidden', '');


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

                    //Hide all elements with hidden class
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

                    OMR_ProjectVars.recordsTable = document.getElementById('recordsTable');

                    //Deletes the previous records shown on screen if the "Get Records" button is pressed again
                    OMR_ProjectVars.recordsTable.innerHTML = "";

                    //Create value to hold current index in ROW for elements
                    OMR_ProjectVars.rowIndex = 0;
                    
                    //Add all records to table in rows of 100
                    OMR_ProjectVars.records.forEach(function(item, recordNum) {
                        OMR_ProjectVars.currRow;
                        
                        //Add new row if we reach 100 records in the current row or if we're starting to build the table
                        if(recordNum % 25  === 0) {
                            OMR_ProjectVars.currRow = OMR_ProjectVars.recordsTable.insertRow();
                            OMR_ProjectVars.rowIndex = 0;
                        }

                        //Create the table cell for the current item, iterate index
                        OMR_ProjectVars.currCell = OMR_ProjectVars.currRow.insertCell(OMR_ProjectVars.rowIndex);
                        OMR_ProjectVars.rowIndex++;


                        //Create label for checkbox
                        OMR_ProjectVars.label = document.createElement('label');
                        OMR_ProjectVars.label.innerHTML = item;

                        //Append label table cell here
                        OMR_ProjectVars.currCell.appendChild(OMR_ProjectVars.label);

                        //Create space between checkbox and label
                        OMR_ProjectVars.currCell.appendChild(document.createElement('br'));

                        //Create the content holding the checkbox input
                        OMR_ProjectVars.check = document.createElement('input');
                        OMR_ProjectVars.check.type = 'checkbox';
                        OMR_ProjectVars.check.value = item;
                        OMR_ProjectVars.check.id = item;
                        OMR_ProjectVars.check.name = 'records[]';
                        OMR_ProjectVars.check.className = 'records';
                        
                        //Append checkbox input to table cell here
                        OMR_ProjectVars.currCell.appendChild(OMR_ProjectVars.check);
                    });
                }

                //Unhide recordsDiv div
                OMR_ProjectVars.recordsDiv = document.getElementById('recordsDiv');
                OMR_ProjectVars.recordsDiv.removeAttribute('hidden');

                //Unhide check/uncheck all and create buttons on success
                OMR_ProjectVars.createBtn = document.getElementById('create');
                OMR_ProjectVars.createBtn.removeAttribute('hidden');


                OMR_ProjectVars.checkAll = document.getElementById('checkAll');
                OMR_ProjectVars.checkAll.removeAttribute('hidden');
            },
            error: function(response) {
                alert(response);
                console.log(response);
            }
        });
    });


    //Checks/unchecks all records
    $('#checkAll:button').click(function(){
        OMR_ProjectVars.checked = !$(this).data('checked');
        $('input:checkbox').prop('checked', OMR_ProjectVars.checked);
        $(this).val(OMR_ProjectVars.checked ? 'Uncheck All' : 'Check All' )
        $(this).data('checked', OMR_ProjectVars.checked);
    });


    $('#create').on('click', function() {
        $.ajax({
            type: "POST",
            url: "../functions/create_printouts_func.php",
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
                OMR_ProjectVars.responseArr = response;
                
                if(!OMR_ProjectVars.responseArr.includes(';')) {
                    console.log(response);
                    alert(response);
                }
                else {
                    OMR_ProjectVars.responseArr = response.split(';');

                    //Display the message of which records had printouts made for them to the user
                    OMR_ProjectVars.message = OMR_ProjectVars.responseArr[0];
                    console.log(OMR_ProjectVars.message);
                    alert(OMR_ProjectVars.message);

                    //Parse the filepath of the new printout
                    OMR_ProjectVars.stampedPath = OMR_ProjectVars.responseArr[1];

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

                    //Create scans container
                    OMR_ProjectVars.scansContainer = document.createElement('div');
                    OMR_ProjectVars.scansContainer.id = 'scansContainer';

                    //Creates scans iframe that holds sdaps scans result
                    OMR_ProjectVars.scans = document.createElement('iframe');
                    OMR_ProjectVars.scans.id = 'scans';
                    OMR_ProjectVars.scans.src = OMR_ProjectVars.stampedPath;

                    //Create the download link for the scans
                    OMR_ProjectVars.scansContainer.innerHTML += "<p>Download scans <a href="+OMR_ProjectVars.stampedPath+" download>here.</a></p>";

                    //Add scans container to div container, append scans to it
                    OMR_ProjectVars.iframeContainer.appendChild(OMR_ProjectVars.scansContainer);
                    OMR_ProjectVars.scansContainer.appendChild(OMR_ProjectVars.scans);
                }
            },
            error: function(response) {
                alert(response);
                console.log(response);
            }
        });
    })
});
