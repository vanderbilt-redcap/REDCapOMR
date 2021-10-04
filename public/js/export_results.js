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
                
                //If the error variable is filled, alert and log it
                if($.trim(response.error)) {
                    //Hide all elements that shouldn't be visible after error is thrown to client
                    OMR_ProjectVars.exportDiv = document.getElementById('exportDiv');
                    OMR_ProjectVars.exportDiv.setAttribute('hidden', '');

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
                    OMR_ProjectVars.exportDiv = document.getElementById('exportDiv');
                    OMR_ProjectVars.exportDiv.setAttribute('hidden', '');

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
                OMR_ProjectVars.exportDiv = document.getElementById('exportDiv');
                OMR_ProjectVars.exportDiv.innerHTML = '';

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


    
    $("#instruments").change(function(){
        OMR_ProjectVars.projectPath = document.getElementById('instruments').value;

        $.ajax({
            type: "POST", 
            url: "../requires/check_csv.php",
            data: {
                projectPath: OMR_ProjectVars.projectPath
            },
            dataType: "text",
            success: function(response) {
                OMR_ProjectVars.exportDiv = document.getElementById('exportDiv');
                OMR_ProjectVars.runButton = document.getElementById('run');
                OMR_ProjectVars.sdapsTable = document.getElementById('sdapsTable');
                OMR_ProjectVars.noUploads = document.getElementById('noUploadsText');
                OMR_ProjectVars.optionId = $(this).find("option:selected").attr("id");
                
                 if(!OMR_ProjectVars.optionId == document.getElementById('default')) {
                    OMR_ProjectVars.exportDiv.setAttribute('hidden', '');
                }
                else {
                    OMR_ProjectVars.exportDiv.removeAttribute('hidden');
                    if(response == 'true') {
                        OMR_ProjectVars.runButton.removeAttribute('hidden');
                        OMR_ProjectVars.sdapsTable.removeAttribute('hidden');
                        OMR_ProjectVars.noUploads.setAttribute('hidden', '');
                    }
                    else {
                        OMR_ProjectVars.noUploads.removeAttribute('hidden');
                        OMR_ProjectVars.sdapsTable.setAttribute('hidden', '');
                        OMR_ProjectVars.runButton.setAttribute('hidden', '');
                    }
                }

                //Creates function to send ajax call to our csv file and print its contents
                OMR_ProjectVars.createTable = function() {
                    $.ajax({
                        url: OMR_ProjectVars.projectPath + '/data_1.csv',
                        dataType: 'text',
                        success: function(data) {
                            OMR_ProjectVars.sdapsData = data.split(/\r?\n|\r/);
                            OMR_ProjectVars.tableData = '<table class="table table-bordered table-striped">';
            
                            for(OMR_ProjectVars.count = 0; OMR_ProjectVars.count < OMR_ProjectVars.sdapsData.length-1; OMR_ProjectVars.count++) {
                                OMR_ProjectVars.cellData = OMR_ProjectVars.sdapsData[OMR_ProjectVars.count].split(",");
                                OMR_ProjectVars.tableData += '<tr>';
             
                                for(OMR_ProjectVars.cellCount = 0; OMR_ProjectVars.cellCount<OMR_ProjectVars.cellData.length; OMR_ProjectVars.cellCount++) {
                                    if(OMR_ProjectVars.count === 0) {
                                        OMR_ProjectVars.tableData += '<th>'+OMR_ProjectVars.cellData[OMR_ProjectVars.cellCount]+'</th>';
                                    }
                                    else {
                                        OMR_ProjectVars.tableData += '<td>'+OMR_ProjectVars.cellData[OMR_ProjectVars.cellCount]+'</td>';
                                    }
                                }
                                OMR_ProjectVars.tableData += '</tr>';
                            }
                            OMR_ProjectVars.tableData += '</table></div>';
                            $('#sdapsTable').html(OMR_ProjectVars.tableData);
                        },
                        error: function(response) {
                            console.log('Could not find file ' + OMR_ProjectVars.projectPath + '/data_1.csv');
                        }
                    });
                };

                //Call our function to create the table and its data
                OMR_ProjectVars.createTable();
            },
            error: function() {
                alert('Failed to find csv data in project: ' + OMR_ProjectVars.projectPath);
            }
        });
    });

    $('#run').on('click', function() {
        $.ajax({
            type: "POST",
            url: "../functions/export_results_func.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val(),
                instruments: $('#instruments').val(),
                fieldName: $('#fields').val()
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