$(document).ready(function() {
    let OMR_StartSessionVars = {};
    OMR_StartSessionVars.createForm = document.getElementById('createForm');
    OMR_StartSessionVars.selectForm = document.getElementById('selectForm');



    //Pull up the project creation form, redirect to 'Create Printouts' once done
    $('#createBtn').on('click', function() {
        //Hide the other button's form if this button was pressed
        OMR_StartSessionVars.selectForm.setAttribute('hidden', '');
        OMR_StartSessionVars.createForm.removeAttribute('hidden');

        //Make button appear active (looking at its form)
        $('#createBtn').addClass('active');
        $('#selectBtn').removeClass('active');
    });



    //Pull up a list of existing projects and allow the user to select one to continue with
    $('#selectBtn').on('click', function() {
        //Hide the other button's form if this button was pressed
        OMR_StartSessionVars.createForm.setAttribute('hidden', '');
        OMR_StartSessionVars.selectForm.removeAttribute('hidden');

        //Make button appear active (looking at its form)
        $('#selectBtn').addClass('active');
        $('#createBtn').removeClass('active');

        
    });



    $('#validate').on('click', function() {

        $.ajax({
            type: 'POST',
            url: 'public/../requires/start_session.php',
            data: {
                apiToken: $('#apiToken').val(),
                apiUrl: $('#apiUrl').val()
            },
            dataType: 'text',
            success: function(response) {
                if(response === 'true') {
                    window.location.replace('forms/create_project.php');
                }
                else {
                    alert("Error: " + response);
                    console.log("Error: " + response);
                }
            },
            error: function(response) {
                alert("Error: " + response);
                console.log("Error: " + response);
            }
        });

    });

});
