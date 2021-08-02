$(document).ready(function() {

    $('#validate').on('click', function() {

        $.ajax({
            type: 'POST',
            url: '../requires/start_session.php',
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