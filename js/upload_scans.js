$(document).ready(function() {
    OMR_UploadScansVars = {};

    $("#projects").change(function(){
        OMR_UploadScansVars.addScans = document.getElementById('addScans');
        OMR_UploadScansVars.optionId = $(this).find("option:selected").attr("id");
      
        if(!OMR_UploadScansVars.optionId == document.getElementById('default')) {
            OMR_UploadScansVars.addScans.setAttribute('hidden', '');
        }
        else {
            OMR_UploadScansVars.addScans.removeAttribute('hidden');
        }
    });

    $('#upload').on('click', function() {
        //Create object to hold form data for file uploads
        OMR_UploadScansVars.ajaxData = new FormData($('#form')[0]);
        //Iterate through files and append all to data
        $.each($("input[type=file]"), function(i, obj) {
            $.each(obj.files,function(j, file){
                OMR_UploadScansVars.ajaxData.append('upload['+j+']', file);
            });
        });
        OMR_UploadScansVars.ajaxData.append('project', document.getElementById('projects').value);

        for(let i of OMR_UploadScansVars.ajaxData) {
            console.log(i);
        }

        $.ajax({
            type: "POST",
            url: "../upload_scan_func.php",
            data: OMR_UploadScansVars.ajaxData,
            dataType: "text",
            processData: false,
            contentType: false,
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