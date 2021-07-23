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

    $("#instruments").change(function(){
        OMR_ProjectCreateVars.projectPath = $('#instruments').val();

        OMR_ProjectCreateVars.recordsDiv = document.getElementById('recordsDiv');
        OMR_ProjectCreateVars.recordsDiv.setAttribute('hidden', '');
        OMR_ProjectCreateVars.recordsUl = document.getElementById('recordsUl');
        OMR_ProjectCreateVars.recordsUl.innerHTML = '';
        
        //Create and clear previous content from tabs
        OMR_ProjectCreateVars.tabs = document.getElementById('tabs');
        OMR_ProjectCreateVars.tabs.innerHTML = '';
        OMR_ProjectCreateVars.tabs.setAttribute('hidden', '');

        OMR_ProjectCreateVars.content = document.getElementById('content');
        OMR_ProjectCreateVars.content.innerHTML = '';
        OMR_ProjectCreateVars.content.setAttribute('hidden', '');

        $.ajax({
            url: OMR_ProjectCreateVars.projectPath + '/record_printouts.txt',
            type: 'HEAD',
            success: function() {
                OMR_ProjectCreateVars.recordsDiv = document.getElementById('recordsDiv');
                OMR_ProjectCreateVars.recordsDiv.removeAttribute('hidden');
            },
            error: function() {
                alert('No printouts were found.  Please create them in the Create Printouts tab.');
                console.log('No printouts were found.  Please create them in the Create Printouts tab.');
            }
        });
    });

    $('#getRecords').on('click', function() {
        OMR_ProjectCreateVars.view = document.getElementById('view');
        OMR_ProjectCreateVars.view.removeAttribute('hidden');

        //Trim directories off of instrument name so records for it can be retrieved from REDCap
        OMR_ProjectCreateVars.project = $('#instruments').val();

        //Get the contents of record_printouts.txt and put its contents into dynamic checkboxes
        $(function(){
            $.get(OMR_ProjectCreateVars.project + '/record_printouts.txt', function(data) {
                if(data !== null) {
                    //Get the file's content and parse it by line breaks
                    OMR_ProjectCreateVars.fileContent =  data.split(/\r?\n|\r/);

                    //var for ul holding records
                    OMR_ProjectCreateVars.recordsUl = document.getElementById('recordsUl');

                    //Deletes the previous records shown on screen if the "Get Records" button is pressed again
                    OMR_ProjectCreateVars.recordsUl.innerHTML = "";

                    //Number of cols in ul output
                    OMR_ProjectCreateVars.columnAmt = 0;

                    console.log(OMR_ProjectCreateVars.fileContent[0]);

                    for(let i = 0; i < OMR_ProjectCreateVars.fileContent.length-1; i++) {
                        //Adds 1 to a variable to make columns for every 10 elements
                        if((i+1) % 10 === 0) {
                            OMR_ProjectCreateVars.columnAmt++;
                        }

                        if(i !== 0) {
                            OMR_ProjectCreateVars.br = document.createElement('br');
                            OMR_ProjectCreateVars.recordsUl.appendChild(OMR_ProjectCreateVars.br);
                        }

                        //Separate the record and the filepath to its printout into separate vars
                        OMR_ProjectCreateVars.currRecord = OMR_ProjectCreateVars.fileContent[i].split(';');
                        OMR_ProjectCreateVars.recordId = OMR_ProjectCreateVars.currRecord[0];
                        OMR_ProjectCreateVars.printoutPath = OMR_ProjectCreateVars.currRecord[1];

                        //Create all the other parts of the checkboxes and append them to the ul
                        OMR_ProjectCreateVars.check = document.createElement('input');
                        OMR_ProjectCreateVars.check.type = 'checkbox';
                        OMR_ProjectCreateVars.check.value = OMR_ProjectCreateVars.printoutPath;
                        OMR_ProjectCreateVars.check.id = OMR_ProjectCreateVars.recordId;
                        OMR_ProjectCreateVars.check.name = 'records[]';
                        OMR_ProjectCreateVars.check.className = 'records';
                        OMR_ProjectCreateVars.recordsUl.appendChild(OMR_ProjectCreateVars.check);

                        //OMR_ProjectCreateVars.check.setAttribute('disabled', 'disabled');

                        //Create the label next to the checkbox on the screen
                        OMR_ProjectCreateVars.label = document.createElement('label');
                        OMR_ProjectCreateVars.label.innerHTML = OMR_ProjectCreateVars.recordId;
                        OMR_ProjectCreateVars.recordsUl.appendChild(OMR_ProjectCreateVars.label);
                    }

                    //Create a new column for every 10 elements
                    OMR_ProjectCreateVars.recordsUl.style.columnCount = OMR_ProjectCreateVars.columnAmt;
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
        OMR_ProjectCreateVars.recordList = [];
        OMR_ProjectCreateVars.recordNums = [];

        //Add each checked box to the array
        $("input:checkbox[type=checkbox]:checked").each(function() {
            OMR_ProjectCreateVars.recordList.push($(this).val());
            OMR_ProjectCreateVars.recordNums.push($(this).attr('id'));
        });

        //Array to hold filepaths of previously-iterated boxes so that we can check for duplicates
        OMR_ProjectCreateVars.filePaths = [];

        //Create and clear previous content from tabs
        OMR_ProjectCreateVars.tabs = document.getElementById('tabs');
        OMR_ProjectCreateVars.tabs.innerHTML = '';

        OMR_ProjectCreateVars.content = document.getElementById('content');
        OMR_ProjectCreateVars.content.innerHTML = '';

        for(let i = 0, j = 0; i < OMR_ProjectCreateVars.recordList.length; i++) {
            if(OMR_ProjectCreateVars.filePaths.includes(OMR_ProjectCreateVars.recordList[i])) {
                continue;
            }
            else {
                OMR_ProjectCreateVars.filePaths[j] = OMR_ProjectCreateVars.recordList[i];
                j++;

                //Create tab for the current printout iframe
                OMR_ProjectCreateVars.tabName = document.createElement('li');
                OMR_ProjectCreateVars.tabName.innerHTML += '<a class="nav-link" data-target="#tab'+OMR_ProjectCreateVars.recordNums[i]+'" data-toggle="tab">'+OMR_ProjectCreateVars.recordNums[i]+'</a>';

                //Create scans containers for each iframe and tab
                OMR_ProjectCreateVars.scansContainer = document.createElement('div');
                OMR_ProjectCreateVars.scansContainer.id = 'tab'+OMR_ProjectCreateVars.recordNums[i];

                if(j === 1) {
                    OMR_ProjectCreateVars.tabName.className = 'nav-item active';
                    OMR_ProjectCreateVars.scansContainer.className = 'tab-pane active';
                }
                else {
                    OMR_ProjectCreateVars.scansContainer.className = 'tab-pane';
                }

                //Creates scans iframe that holds sdaps scans result
                OMR_ProjectCreateVars.scans = document.createElement('iframe');
                OMR_ProjectCreateVars.scans.id = OMR_ProjectCreateVars.recordNums[i];
                OMR_ProjectCreateVars.scans.src = '../' + OMR_ProjectCreateVars.recordList[i];

                //Create the download link for the scans
                OMR_ProjectCreateVars.scansContainer.innerHTML += "<p>Download scans <a href="+OMR_ProjectCreateVars.scans.src+" download>here.</a></p>";

                //Styling for the iframe and div holding its content
                $('#content').css('text-align', 'center');
                $('#content iframe').css('margin', 'auto');
                $('#content iframe').css('height', '55em');
                $('#content iframe').css('width', '75%'); 
                OMR_ProjectCreateVars.tabs.removeAttribute('hidden');
                OMR_ProjectCreateVars.content.removeAttribute('hidden');

                //Add scans container to div container, append scans to it
                OMR_ProjectCreateVars.tabs.appendChild(OMR_ProjectCreateVars.tabName);
                OMR_ProjectCreateVars.content.appendChild(OMR_ProjectCreateVars.scansContainer);
                OMR_ProjectCreateVars.scansContainer.appendChild(OMR_ProjectCreateVars.scans);
            }
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