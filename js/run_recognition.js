$(document).ready(function() {
    OMR_ProjectAnalyzeVars = {};

    $("#projects").change(function(){
        OMR_ProjectAnalyzeVars.projectPath = document.getElementById('projects').value;
        OMR_ProjectAnalyzeVars.uploadPath = OMR_ProjectAnalyzeVars.projectPath + '/uploads';

        console.log(OMR_ProjectAnalyzeVars.uploadPath + ', ' + OMR_ProjectAnalyzeVars.projectPath);
        $.ajax({
            type: "POST", 
            url: "../requires/check_file.php",
            data: {
                uploadPath: OMR_ProjectAnalyzeVars.uploadPath
            },
            dataType: "text",
            success: function(response) {
                OMR_ProjectAnalyzeVars.runRecognition = document.getElementById('runRecognition');
                OMR_ProjectAnalyzeVars.runButton = document.getElementById('run');
                OMR_ProjectAnalyzeVars.noUploads = document.getElementById('noUploadsText');
                OMR_ProjectAnalyzeVars.optionId = $(this).find("option:selected").attr("id");
      
                 if(!OMR_ProjectAnalyzeVars.optionId == document.getElementById('default')) {
                    OMR_ProjectAnalyzeVars.runRecognition.setAttribute('hidden', '');
                }
                else {
                    OMR_ProjectAnalyzeVars.runRecognition.removeAttribute('hidden');
                    if(response == 'true') {
                        OMR_ProjectAnalyzeVars.runButton.removeAttribute('hidden');
                        OMR_ProjectAnalyzeVars.noUploads.setAttribute('hidden', '');
                    }
                    else {
                        OMR_ProjectAnalyzeVars.noUploads.removeAttribute('hidden');
                        OMR_ProjectAnalyzeVars.runButton.setAttribute('hidden', '');
                    }
                }
            },
            error: function() {
                alert('Failed to verify path of uploads folder for project: ' + OMR_ProjectAnalyzeVars.projectPath);
            }
        });
    });

    $('#run').on('click', function() {
        OMR_ProjectAnalyzeVars.projectPath = document.getElementById('projects').value;
        OMR_ProjectAnalyzeVars.uploadPath = OMR_ProjectAnalyzeVars.projectPath + '/uploads';

        $.ajax({
            type: "POST",
            url: "../analyze_func.php",
            data: {
                projectPath: OMR_ProjectAnalyzeVars.projectPath,
                uploadPath: OMR_ProjectAnalyzeVars.uploadPath
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