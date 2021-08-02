<?php 

/**
 * Created by Cody Johnson.
 * 
 * Converts a REDCap data dictionary to a LaTeX file with SDAPS's
 * specific class types.  The string result created from this php file
 * can be saved and used as the template for the SDAPS project in the main program.
 * 
 * TODO: Debugging, 
 *       possibly adding more field types if deemed appropriate,
 */

class json2latex {

    /**
     * Creates LaTeX/SDAPS template header for project.
     * Should be the first function used when creating a .tex template
     * Define the header of the file, contents of data dict will come after it.
     * 
     * @throws Exception
     * @return string header
     */
    private static function createHeader($meta, $instruments, $author) {
        //Get the list of project instruments into a readable format
        $instruments = json_decode($instruments);
        //Parse info about the data dict to determine the survey name
        $title = $meta[0]->form_name;

        //Checks all project instruments for the project label associated with the form name
        foreach($instruments as $instrument) {
            if($instrument->instrument_name === $title) {
                $title = $instrument->instrument_label;
                break;
            }
        }

        //Change the author name (REDCap distribution that created project) to first-letter uppercase
        $author = ucfirst($author);

        //Language is english by default, but if spanish is detected in the title, we change the doc language
        //Note: This is a hacky way to check language, ideally this would be done with a language recognizer
        $language = 'english';
        if(stripos($title, 'Spanish')) {
            $language = 'spanish';
        }

        //Determines if the testing mode (ability to put X marks in boxes in PDF editor) is enabled.
        //1 = on, non-1 = off
        $testingMode = 0;
        $testingString = '';
        if($testingMode === 1) {
            $testingString = '
            \usepackage{sdapspdf}
            \ExplSyntaxOn
            \sdaps_context_append:nn{*}{pdf_form=true}
            \ExplSyntaxOff';
        }

        //Creates header of questionnaire with title and author pulled dynamically from REDCap
        $tex = '
            \documentclass['.$language.',pagemark,stamp,oneside,print_questionnaire_id]{sdapsclassic}
            \usepackage[utf8]{inputenc}
            \usepackage[T1]{fontenc}
            \usepackage{multicol}

            \renewcommand{\familydefault}{\sfdefault}

            '.$testingString.'
    
            \author{'.$author.'}
            \title{'.$title.' | ID: \qid}
    
            \begin{document}
                \begin{questionnaire}
                \begin{Form}
                    
                \section{Questions}';

        return $tex;
    }


    /**
     * Creates LaTeX/SDAPS template footer for project.
     * Should be the last function used in the .tex template creation.
     * Define the footer of the file, all contents of data dict will come before it.
     * 
     * @throws Exception
     * @return string footer
     */
    private static function createFooter($tex) {
        $tex = $tex . '
                \end{Form}
                \end{questionnaire}
            \end{document}';

        return $tex;
    }

    /**
     * Creates LaTeX/SDAPS questionnaire generated from survey questions.
     * The workhorse of the form creation, probably unoptimal.
     * 
     * @throws Exception
     * @return string body
     */
    public static function createQuestionnaire($json, $instruments, $author) {
        //Initializes tex file as empty and decodes data dict into a readable format
        $tex = '';
        $meta = json_decode($json);



        //Creates and initializes all the details of the header of the .tex document
        $tex = self::createHeader($meta, $instruments, $author);
        


        //Declare $choices to check in making \optiongroups and \choicegroups later
        //Also declare $grouped array to check grouped question matrices in the form
        $choices = array();
        $grouped = array();

        //Get an array of all answer choices for each question, 
        //must be done before finding groups of same answers
        foreach($meta as $key => $val) {
            //Get the descriptions for the choices out of the current question
            $choices[$key] = self::trimChoices($val->select_choices_or_calculations);
        }


        //Find all groups with same answers in survey
        foreach($meta as $key => $val) {
            //Skip first key so that we don't refer to an undefined instance of choices array
            if($key === 0) continue;

            //For every other element...
            else {
                //Pulls the first answer for question, ungroups if it has none
                if($choices[$key][0] === '') {
                    $grouped[$key] = false;
                }
                //If the two questions have the same answers, they are a group
                else if($choices[$key-1] === $choices[$key]) {
                    //If the previous element was false, make it true since grouped
                    if(!$grouped[$key-1]) {
                        $grouped[$key-1] = true;
                    }
                    //Make the question be recognized as grouped
                    $grouped[$key] = true;
                }
                //Assign false values to remaining questions since they have no groups
                else {
                    //$choices[0] is the only instance where we should set previous index value
                    if($key === 1) {
                        $grouped[$key-1] = false;
                    }
                    //Set to false
                    $grouped[$key] = false;
                }
            }
        }

        //Remove every "grouped" element that has no section header
        foreach($meta as $key => $val) {
            if($key === 0) continue;

            //Only go through loop if grouped
            if($grouped[$key]) {
                //A question will be the first in a group if the one before
                //it had different answers
                if($choices[$key-1] !== $choices[$key]) {
                    //If the first question's section header is empty, ungroup it
                    if($meta[$key]->section_header === '') {
                        $grouped[$key] = false;
                        //Ungroup all elements that were in the group
                        for($i = $key; $choices[$key] === $choices[$i] && $i < count($meta)-1; $i++) {
                            $grouped[$i] = false;
                        }
                    }
                }
            }
        }


        //Run through each question in the survey and generate the final LaTeX result
        foreach($meta as $key => $val) {

            //If the field is flagged as hidden, we skip it and don't include it on the survey
            if(strpos($val->field_annotation, '@HIDDEN-SURVEY') !== false || strpos($val->field_annotation, '@HIDDEN') !== false) {
                continue;
            }
            //NOTE: Skipping other types (text, notes, etc, will require making a file of those types
            //      and passing them to export_results_func.php so each type can be dynamically ignored for the project)

            //Removes errant HTML objects from field labels and section headers (both descriptive)
            $val->field_label = preg_replace('/<(.*?)>/', '', $val->field_label);
            $val->section_header = preg_replace('/<(.*?)>/', '', $val->section_header);

            //Pulls the question description out of each data dictionary question entry
            $desc = trim($val->field_label);

            //Pulls the section info from the question and trims white space from it
            $sectionInfo = trim($val->section_header);

            //Checks to see if a group was finished.  
            //Must be included for ALL field types, so we include it at the start of every iteration
            if($key > 0) {
                //End the last group if there is another one with different choices now
                if($choices[$key-1] !== $choices[$key] || $meta[$key-1]->matrix_group_name !== $meta[$key]->matrix_group_name) {
                    
                    //Check if previous group was radio or checkbox
                    if($meta[$key-1]->field_type === 'radio' && $grouped[$key-1]) {
                        //End the previous optiongroup since it was radio
                        $tex = $tex . '
                            \end{optiongroup}
                        ';
                    }
                
                    //Only other option is checkbox (currently)
                    else if($meta[$key-1]->field_type === 'checkbox' && $grouped[$key-1]) {
                        $tex = $tex . '
                            \end{choicegroup}
                        ';
                    }
                }
            }

            //Starts the codeblock that determines the field type of the question and casts it properly
            //...if it is a text descriptive field (don't show ID number on survey)
            if(isset($val->field_type) && $val->field_type === 'text' && $val->field_name !== 'record_id') {

                //...if the field is a section header, it should be added as info
                if($val->section_header !== '') {
                    $tex = $tex . '
                    \begin{info}
                        '.$sectionInfo.'
                    \end{info}';
                }

                //Add info section to top of page body
                $tex = $tex . '
                    \textbox*{1cm}{'.$desc.'}';
            }
             
            
            //...if it is a radio button question (one answer only)
            else if(isset($val->field_type) && $val->field_type === 'radio') {

                if($grouped[$key]) {
                    //Check if current index is the first index in the choices array
                    if($key === 0) {
                        $tex = $tex . '
                           \begin{optiongroup}{'.$sectionInfo.'}
                        ';
                    }

                    //Put the choices into the option group ONLY when you're starting the group
                    if($choices[$key-1] !== $choices[$key] || $meta[$key-1]->matrix_group_name !== $meta[$key]->matrix_group_name) {
                        $tex = $tex . '
                           \begin{optiongroup}{'.$sectionInfo.'}
                        ';

                        foreach($choices[$key] as $index => $item) {
                            $tex = $tex . '
                                \choice{'.$item.'}
                            ';
                        }
                    }

                    $tex = $tex . '
                        \question{'.$desc.'\medskip}
                    ';
                }

                else {
                    //...if the field is a section header, it should be added as info
                    if($val->section_header !== '') {
                        $tex = $tex . '
                        \begin{info}
                            '.$sectionInfo.'
                        \end{info}';
                    }

                    //Create the question, changing col placement for every other choice
                    $tex = $tex . '
                        \begin{optionquestion}[singlechoice,cols=1]{'.$desc.'}';
                    
                    //Create the choices in the form
                    foreach($choices[$key] as $index => $item) {
                        //...if current answer is in the latter half of possible answers
                        $tex = $tex . '\choiceitem{'.$item.'}';
                    }

                    //Finish the question
                    $tex = $tex . '\end{optionquestion}';
                }
            }


            //...if it is a checkbox question (more than one answer)
            else if(isset($val->field_type) && $val->field_type === 'checkbox') {

                if($grouped[$key]) {
                    //Check if current index is the first index in the choices array
                    if($key == 0) {
                        $tex = $tex . '
                           \begin{choicegroup}{'.$sectionInfo.'}
                        ';
                    }

                    //Put the choices into the option group ONLY when you're starting the group
                    if($choices[$key-1] !== $choices[$key]) {
                        $tex = $tex . '
                           \begin{choicegroup}{'.$sectionInfo.'}
                        ';

                        foreach($choices[$key] as $index => $item) {
                            $tex = $tex . '
                                \choice{'.$item.'}
                            ';
                        }
                    }

                    $tex = $tex . '
                        \question{'.$desc.'}
                    ';
                }

                else {
                    //...if the field is a section header, it should be added as info
                    if($val->section_header !== '') {
                        $tex = $tex . '
                        \begin{info}
                            '.$sectionInfo.'
                        \end{info}';
                    }

                    //Create the question, changing col placement for every other choice
                    $tex = $tex . '
                        \begin{choicequestion}[cols=1]{'.$desc.'}';
                    
                    //Create the choices in the form
                    foreach($choices[$key] as $index => $item) {
                        //...if current answer is in the latter half of possible answers
                        $tex = $tex . '\choiceitem{'.$item.'}';
                    }

                    //Finish the question
                    $tex = $tex . '\end{choicequestion}';
                }
            }


            //...if the field is a textbox to enter info
            else if(isset($val->field_type) && $val->field_type === 'notes') {

                //...if the field is a section header, it should be added as info
                if($val->section_header !== '') {

                    $tex = $tex . '
                    \begin{info}
                        '.$sectionInfo.'
                    \end{info}';
                }

                //Add info section to top of page body
                $tex = $tex . '
                    \textbox{5cm}{'.$desc.'}';
            }


            //...if the field is plaintext that should be added as info
            else if(isset($val->field_type) && $val->field_type === 'descriptive') {

                //...if the field is a section header, it should be added as info
                if($val->section_header !== '') {
                    $tex = $tex . '
                    \begin{info}
                        '.$sectionInfo.'
                    \end{info}';
                }

                $tex = $tex . '
                    \begin{info}
                        '.$desc.'
                    \end{info}';
            }

            
            //...we don't support the field, skip to the next one
            else {
                continue;
            }
        }



        //Creates the footer of the LaTeX document, finishes its creation
        $tex = self::createFooter($tex);



        return $tex;
    }

    /**
     * Trim the answer choices from the data dict into only the
     * description without the value attached.  
     * Returns only the answer descriptions of each in array form.
     * 
     * @throws Exception
     * @return array choices
     */
    private static function trimChoices($answers) {
        //Make array of answers
        $choices = explode('|', $answers);
        //Remove all numeric characters before the first comma
        $choices = preg_replace('/\G([^,\d]*)\d/', '', $choices);
        
        foreach($choices as $key => $choice) {
            //Remove comma after replaced numeric chars
            $pos = strpos($choice, ',');
            if ($pos !== false) {
                $choice = substr_replace($choice, '', $pos, strlen(','));
                $choices[$key] = $choice;
            }

            //Trim excess white space from string
            $choices[$key] = trim($choice);
        }

        return $choices;
    }
}

?>