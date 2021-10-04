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
                //If we can't trim the response, then it is a blank string (false)
                if(!$.trim(response.results)) {
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
        OMR_ProjectVars.projectPath = $('#instruments').val();

        OMR_ProjectVars.recordsDiv = document.getElementById('recordsDiv');
        OMR_ProjectVars.recordsDiv.setAttribute('hidden', '');
        OMR_ProjectVars.recordsUl = document.getElementById('recordsUl');
        OMR_ProjectVars.recordsUl.innerHTML = '';
        
        //Create and clear previous content from tabs
        OMR_ProjectVars.tabs = document.getElementById('tabs');
        OMR_ProjectVars.tabs.innerHTML = '';
        OMR_ProjectVars.tabs.setAttribute('hidden', '');

        OMR_ProjectVars.content = document.getElementById('content');
        OMR_ProjectVars.content.innerHTML = '';
        OMR_ProjectVars.content.setAttribute('hidden', '');

        $.ajax({
            url: OMR_ProjectVars.projectPath + '/record_printouts.txt',
            type: 'HEAD',
            success: function() {
                OMR_ProjectVars.recordsDiv = document.getElementById('recordsDiv');
                OMR_ProjectVars.recordsDiv.removeAttribute('hidden');
            },
            error: function() {
                alert('No printouts were found.  Please create them in the Create Printouts tab.');
                console.log('No printouts were found.  Please create them in the Create Printouts tab.');
            }
        });
    });

    $('#getRecords').on('click', function() {
        OMR_ProjectVars.view = document.getElementById('view');
        OMR_ProjectVars.view.removeAttribute('hidden');

        //Trim directories off of instrument name so records for it can be retrieved from REDCap
        OMR_ProjectVars.project = $('#instruments').val();

        //Get the contents of record_printouts.txt and put its contents into dynamic checkboxes
        $(function(){
            $.get(OMR_ProjectVars.project + '/record_printouts.txt', function(data) {
                if(data !== null) {
                    //Get the file's content and parse it by line breaks
                    OMR_ProjectVars.fileContent =  data.split(/\r?\n|\r/);

                    //var for ul holding records
                    OMR_ProjectVars.recordsUl = document.getElementById('recordsUl');

                    //Deletes the previous records shown on screen if the "Get Records" button is pressed again
                    OMR_ProjectVars.recordsUl.innerHTML = "";

                    //Number of cols in ul output
                    OMR_ProjectVars.columnAmt = 0;

                    for(let i = 0; i < OMR_ProjectVars.fileContent.length-1; i++) {
                        //Adds 1 to a variable to make columns for every 10 elements
                        if((i+1) % 10 === 0) {
                            OMR_ProjectVars.columnAmt++;
                        }

                        if(i !== 0) {
                            OMR_ProjectVars.br = document.createElement('br');
                            OMR_ProjectVars.recordsUl.appendChild(OMR_ProjectVars.br);
                        }

                        //Separate the record and the filepath to its printout into separate vars
                        OMR_ProjectVars.currRecord = OMR_ProjectVars.fileContent[i].split(';');
                        OMR_ProjectVars.recordId = OMR_ProjectVars.currRecord[0];
                        OMR_ProjectVars.printoutPath = OMR_ProjectVars.currRecord[1];

                        //Create all the other parts of the checkboxes and append them to the ul
                        OMR_ProjectVars.check = document.createElement('input');
                        OMR_ProjectVars.check.type = 'checkbox';
                        OMR_ProjectVars.check.value = OMR_ProjectVars.printoutPath;
                        OMR_ProjectVars.check.id = OMR_ProjectVars.recordId;
                        OMR_ProjectVars.check.name = 'records[]';
                        OMR_ProjectVars.check.className = 'records';
                        OMR_ProjectVars.recordsUl.appendChild(OMR_ProjectVars.check);

                        //OMR_ProjectVars.check.setAttribute('disabled', 'disabled');

                        //Create the label next to the checkbox on the screen
                        OMR_ProjectVars.label = document.createElement('label');
                        OMR_ProjectVars.label.innerHTML = OMR_ProjectVars.recordId;
                        OMR_ProjectVars.recordsUl.appendChild(OMR_ProjectVars.label);
                    }

                    //Create a new column for every 10 elements
                    OMR_ProjectVars.recordsUl.style.columnCount = OMR_ProjectVars.columnAmt;
                }
                else {
                    alert('Could not retrieve record data.');
                    console.log('Could not retrieve record data.');
                }
            });
        });
    });

    $('#view').on('click', function() {
        //Empty the array so we clear it of old records
        OMR_ProjectVars.recordList = [];
        OMR_ProjectVars.recordNums = [];

        //Add each checked box to the array
        $("input:checkbox[type=checkbox]:checked").each(function() {
            OMR_ProjectVars.recordList.push($(this).val());
            OMR_ProjectVars.recordNums.push($(this).attr('id'));
        });

        //Array to hold filepaths of previously-iterated boxes so that we can check for duplicates
        OMR_ProjectVars.filePaths = [];

        //Create and clear previous content from tabs
        OMR_ProjectVars.tabs = document.getElementById('tabs');
        OMR_ProjectVars.tabs.innerHTML = '';

        OMR_ProjectVars.content = document.getElementById('content');
        OMR_ProjectVars.content.innerHTML = '';

        for(let i = 0, j = 0; i < OMR_ProjectVars.recordList.length; i++) {
            if(OMR_ProjectVars.filePaths.includes(OMR_ProjectVars.recordList[i])) {
                continue;
            }
            else {
                OMR_ProjectVars.filePaths[j] = OMR_ProjectVars.recordList[i];
                j++;

                //Create tab for the current printout iframe
                OMR_ProjectVars.tabName = document.createElement('li');
                OMR_ProjectVars.tabName.innerHTML += '<a class="nav-link" data-target="#tab'+OMR_ProjectVars.recordNums[i]+'" data-toggle="tab">'+OMR_ProjectVars.recordNums[i]+'</a>';

                //Create scans containers for each iframe and tab
                OMR_ProjectVars.scansContainer = document.createElement('div');
                OMR_ProjectVars.scansContainer.id = 'tab'+OMR_ProjectVars.recordNums[i];

                if(j === 1) {
                    OMR_ProjectVars.tabName.className = 'nav-item active';
                    OMR_ProjectVars.scansContainer.className = 'tab-pane active';
                }
                else {
                    OMR_ProjectVars.scansContainer.className = 'tab-pane';
                }

                //Creates scans iframe that holds sdaps scans result
                OMR_ProjectVars.scans = document.createElement('iframe');
                OMR_ProjectVars.scans.id = OMR_ProjectVars.recordNums[i];
                OMR_ProjectVars.scans.src = OMR_ProjectVars.recordList[i];

                //Create the download link for the scans
                OMR_ProjectVars.scansContainer.innerHTML += "<p>Download scans <a href="+OMR_ProjectVars.scans.src+" download>here.</a></p>";

                //Styling for the iframe and div holding its content
                $('#content').css('text-align', 'center');
                $('#content iframe').css('margin', 'auto');
                $('#content iframe').css('height', '55em');
                $('#content iframe').css('width', '75%'); 
                OMR_ProjectVars.tabs.removeAttribute('hidden');
                OMR_ProjectVars.content.removeAttribute('hidden');

                //Add scans container to div container, append scans to it
                OMR_ProjectVars.tabs.appendChild(OMR_ProjectVars.tabName);
                OMR_ProjectVars.content.appendChild(OMR_ProjectVars.scansContainer);
                OMR_ProjectVars.scansContainer.appendChild(OMR_ProjectVars.scans);
            }

            //Catch edge case for only 1 scan selected not getting styling
            $('#content').css('text-align', 'center');
            $('#content iframe').css('margin', 'auto');
            $('#content iframe').css('height', '55em');
            $('#content iframe').css('width', '75%');
        }
    });

    //Activates when the iframe div tab is changed
    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        //Get the value of the currently-selected tab (record ID)
        let tab_record = $("#tabs li a.active").text();

        //For each iframe included in the tabs
        $('#content iframe').each(function() {
            //Get the id of each iframe
            //If it has same value as the tab, reload the iframe to make it visible again
            if($(this).attr('id') === tab_record) {
                $('#content').css('text-align', 'center');
                $(this).css('margin', 'auto');
                $(this).css('height', '55em');
                $(this).css('width', '75%');
                $(this).attr('src', $(this).attr('src')); 
            }
        });
    });
});