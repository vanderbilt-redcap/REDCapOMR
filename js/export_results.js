$(document).ready(function() {
    let OMR_DataExportVars = {};

    $('#validate').on('click', function () {
        //Defines global object holding all variables for this project to prevent conflicts
        OMR_DataExportVars.select = document.getElementById('instruments');
        OMR_DataExportVars.form = document.getElementById('formHeader');
        OMR_DataExportVars.instruments = 0;
        OMR_DataExportVars.error = '';

        //Clean up any instrument options from previous validation attempt
        for (i = OMR_DataExportVars.select.length - 1; i >= 0; i--) {
	        OMR_DataExportVars.select.remove(i);
        }
        OMR_DataExportVars.select.length = 0;


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
                    OMR_DataExportVars.instruments = response;

                    OMR_DataExportVars.error = document.getElementById('error');
                    if(OMR_DataExportVars.error) {
                        console.log(OMR_DataExportVars.error);
                        document.getElementById('error').outerHTML = '';
                    }

                    //Split projects into array ONLY if there are multiple included
                    if(OMR_DataExportVars.instruments.includes(',')) {
                        OMR_DataExportVars.instruments = OMR_DataExportVars.instruments.split(',');

                        for(let i = 0; i < OMR_DataExportVars.instruments.length; i++) {
                            //If we're on the first element, add the default option to the select box
                            if(i == 0) {
                                OMR_DataExportVars.opt = document.createElement('option');
                                OMR_DataExportVars.opt.setAttribute('disabled', '');
                                OMR_DataExportVars.opt.setAttribute('selected', '');
                                OMR_DataExportVars.opt.setAttribute('value', '');
                                OMR_DataExportVars.opt.innerHTML = '-- Select an option --';
                                OMR_DataExportVars.select.appendChild(OMR_DataExportVars.opt);
                            }
    
                            OMR_DataExportVars.opt = document.createElement('option');
                            OMR_DataExportVars.opt.value = OMR_DataExportVars.instruments[i];
                            
                            //Trim the instrument name from the project directory for user readability
                            OMR_DataExportVars.innerInst = OMR_DataExportVars.instruments[i].split('/');
                            OMR_DataExportVars.opt.innerHTML = OMR_DataExportVars.innerInst[OMR_DataExportVars.innerInst.length-1];
                            
                            OMR_DataExportVars.select.appendChild(OMR_DataExportVars.opt);
                        }
                    }
                    else {
                        OMR_DataExportVars.opt = document.createElement('option');
                        OMR_DataExportVars.opt.setAttribute('disabled', '');
                        OMR_DataExportVars.opt.setAttribute('selected', '');
                        OMR_DataExportVars.opt.setAttribute('value', '');
                        OMR_DataExportVars.opt.innerHTML = '-- Select an option --';
                        OMR_DataExportVars.select.appendChild(OMR_DataExportVars.opt);

                        OMR_DataExportVars.opt = document.createElement('option');
                        OMR_DataExportVars.opt.value = OMR_DataExportVars.instruments;
                        
                        //Trim the instrument name from the project directory for user readability
                        OMR_DataExportVars.innerInst = OMR_DataExportVars.instruments.split('/');
                        OMR_DataExportVars.opt.innerHTML = OMR_DataExportVars.innerInst[OMR_DataExportVars.innerInst.length-1];
                        
                        OMR_DataExportVars.select.appendChild(OMR_DataExportVars.opt);
                    }

                    

                    OMR_DataExportVars.elements = document.getElementsByClassName('hidden');
                    for(let i = 0; i < OMR_DataExportVars.elements.length; i++) {
                        OMR_DataExportVars.elements[i].removeAttribute('hidden');
                    }
                }
            },
            error: function() {
                console.log("Could not retrieve project information from API key and URL.");

                OMR_DataExportVars.elements = document.getElementsByClassName('hidden');
                for(let i = 0; i < OMR_DataExportVars.elements.length; i++) {
                    OMR_DataExportVars.elements[i].setAttribute('hidden', '');
                }

                if(!$('#error').length) {
                    OMR_DataExportVars.error = document.createElement('h4');
                    OMR_DataExportVars.error.id = 'error';
                    OMR_DataExportVars.error.innerHTML = 'API token is incorrect for the given URL.';
                    OMR_DataExportVars.form.appendChild(OMR_DataExportVars.error);
                }
            }
        });
    });

    $("#instruments").change(function(){
        OMR_DataExportVars.projectPath = document.getElementById('instruments').value;

        $.ajax({
            type: "POST", 
            url: "../requires/check_csv.php",
            data: {
                projectPath: OMR_DataExportVars.projectPath
            },
            dataType: "text",
            success: function(response) {
                OMR_DataExportVars.runRecognition = document.getElementById('runRecognition');
                OMR_DataExportVars.runButton = document.getElementById('run');
                OMR_DataExportVars.sdapsTable = document.getElementById('sdapsTable');
                OMR_DataExportVars.noUploads = document.getElementById('noUploadsText');
                OMR_DataExportVars.optionId = $(this).find("option:selected").attr("id");
                
                 if(!OMR_DataExportVars.optionId == document.getElementById('default')) {
                    OMR_DataExportVars.runRecognition.setAttribute('hidden', '');
                }
                else {
                    OMR_DataExportVars.runRecognition.removeAttribute('hidden');
                    if(response == 'true') {
                        OMR_DataExportVars.runButton.removeAttribute('hidden');
                        OMR_DataExportVars.sdapsTable.removeAttribute('hidden');
                        OMR_DataExportVars.noUploads.setAttribute('hidden', '');
                    }
                    else {
                        OMR_DataExportVars.noUploads.removeAttribute('hidden');
                        OMR_DataExportVars.sdapsTable.setAttribute('hidden', '');
                        OMR_DataExportVars.runButton.setAttribute('hidden', '');
                    }
                }

                //Creates function to send ajax call to our csv file and print its contents
                OMR_DataExportVars.createTable = function() {
                    $.ajax({
                        url: OMR_DataExportVars.projectPath + '/data_1.csv',
                        dataType: 'text',
                        success: function(data) {
                            OMR_DataExportVars.sdapsData = data.split(/\r?\n|\r/);
                            OMR_DataExportVars.tableData = '<table class="table table-bordered table-striped">';
            
                            for(OMR_DataExportVars.count = 0; OMR_DataExportVars.count < OMR_DataExportVars.sdapsData.length-1; OMR_DataExportVars.count++) {
                                OMR_DataExportVars.cellData = OMR_DataExportVars.sdapsData[OMR_DataExportVars.count].split(",");
                                OMR_DataExportVars.tableData += '<tr>';
             
                                for(OMR_DataExportVars.cellCount = 0; OMR_DataExportVars.cellCount<OMR_DataExportVars.cellData.length; OMR_DataExportVars.cellCount++) {
                                    if(OMR_DataExportVars.count === 0) {
                                        OMR_DataExportVars.tableData += '<th>'+OMR_DataExportVars.cellData[OMR_DataExportVars.cellCount]+'</th>';
                                    }
                                    else {
                                        OMR_DataExportVars.tableData += '<td>'+OMR_DataExportVars.cellData[OMR_DataExportVars.cellCount]+'</td>';
                                    }
                                }
                                OMR_DataExportVars.tableData += '</tr>';
                            }
                            OMR_DataExportVars.tableData += '</table></div>';
                            $('#sdapsTable').html(OMR_DataExportVars.tableData);
                        },
                        error: function(response) {
                            console.log('Could not find file ' + OMR_DataExportVars.projectPath + '/data_1.csv');
                        }
                    });
                };

                //Call our function to create the table and its data
                OMR_DataExportVars.createTable();
            },
            error: function() {
                alert('Failed to find csv data in project: ' + OMR_DataExportVars.projectPath);
            }
        });
    });

    $('#run').on('click', function() {
        $.ajax({
            type: "POST",
            url: "../export_results_func.php",
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val(),
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