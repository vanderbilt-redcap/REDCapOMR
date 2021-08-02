<?php 

/**
 * Created by Cody Johnson.
 * 
 * *BACKUP OF OLDER VERSION, NO LONGER CURRENT*
 * 
 * Converts a REDCap data dictionary to a LaTeX file with SDAPS's
 * specific class types.  The string result created from this php file
 * can be saved and used as the template for the SDAPS project in the main program.
 * 
 * TODO: Debugging, 
 *       possibly adding more field types if deemed appropriate,
 *       \author should be dynamic if possible (createHeader)
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
    public static function createHeader($json) {
        //Parse info about the data dict to determine the survey name
        $meta = json_decode($json);

        $title = $meta[0]->form_name;
        $title = str_replace("_", " ", $title);
        $title = ucwords($title);

        //Creates header of string
        $tex = '
            \documentclass[english,pagemark,stamp,oneside,print_questionnaire_id]{sdapsclassic}
            \usepackage[utf8]{inputenc}
            % For demonstration purposes
            \usepackage{multicol}

            \usepackage{sdapspdf}
            \ExplSyntaxOn
            \sdaps_context_append:nn{*}{pdf_form=true}
            \ExplSyntaxOff

            \author{Vanderbilt University Medical Center}
            \title{'.$title.'}

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
    public static function createFooter($tex) {
        $tex = $tex . '
                \end{Form}
                \end{questionnaire}
            \end{document}';

        return $tex;
    }

    /**
     * Creates LaTeX/SDAPS questions generated from survey questions.
     * The workhorse of the form creation, probably unoptimal.
     * 
     * @throws Exception
     * @return string body
     */
    public static function createBody($tex, $json) {
        $meta = json_decode($json);
        
        //Declare $choices to check in making \optiongroups and \choicegroups later
        //Also declare $grouped array to check if each 
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
                    //
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

            //Removes errant HTML objects from field labels and section headers (both descriptive)
            $val->field_label = preg_replace('/<(.*?)>/', '', $val->field_label);
            $val->section_header = preg_replace('/<(.*?)>/', '', $val->section_header);


            //...if it is a text descriptive field (don't show ID number on survey)
            if(isset($val->field_type) && $val->field_type === 'text' && $val->field_name !== 'record_id') {
                $entryInfo = $val->field_label;


                /****************************************/
                if($key > 0) {
                    //End the last group if there is another one with different choices now
                    if($choices[$key-1] !== $choices[$key]) {
                        
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
                /*****************************************/


                //...if the field is a section header, it should be added as info
                if($val->section_header !== '') {
                    $sectionInfo = $val->section_header;

                    $tex = $tex . '
                    \begin{info}
                        '.$sectionInfo.'
                    \end{info}';
                }

                //Add info section to top of page body
                $tex = $tex . '
                    \textbox{1cm}{'.$entryInfo.'}';
            }
             
            
            //...if it is a radio button question (one answer only)
            else if(isset($val->field_type) && $val->field_type === 'radio') {
                $desc = $val->field_label;
                $sectionInfo = $val->section_header;


                /******************************************/
                if($key > 0) {
                    //End the last group if there is another one with different choices now
                    if($choices[$key-1] !== $choices[$key]) {
                        
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
                /**************************************/


                if($grouped[$key]) {
                    //Check if current index is the first index in the choices array
                    if($key === 0) {
                        $tex = $tex . '
                           \begin{optiongroup}{'.$sectionInfo.'}
                        ';
                    }

                    //Put the choices into the option group ONLY when you're starting the group
                    if($choices[$key-1] !== $choices[$key]) {
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
                $desc = $val->field_label;
                $sectionInfo = $val->section_header;


                /*********************************************/
                if($key > 0) {
                    //End the last group if there is another one with different choices now
                    if($choices[$key-1] !== $choices[$key]) {
                        
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
                /************************************************/

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

                    //Trims the answers into only the choice descriptions
                    //$choices = self::trimChoices($val->select_choices_or_calculations);

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
                $entryInfo = $val->field_label;
                

                /*******************************************/
                if($key > 0) {
                    //End the last group if there is another one with different choices now
                    if($choices[$key-1] !== $choices[$key]) {
                        
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
                /*******************************************/


                //...if the field is a section header, it should be added as info
                if($val->section_header !== '') {
                    $sectionInfo = $val->section_header;

                    $tex = $tex . '
                    \begin{info}
                        '.$sectionInfo.'
                    \end{info}';
                }

                //Add info section to top of page body
                $tex = $tex . '
                    \textbox{5cm}{'.$entryInfo.'}';
            }


            //...if the field is plaintext that should be added as info
            else if(isset($val->field_type) && $val->field_type === 'descriptive') {
                $entryInfo = $val->field_label;


                /*******************************************/
                if($key > 0) {
                    //End the last group if there is another one with different choices now
                    if($choices[$key-1] !== $choices[$key]) {
                        
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
                /**********************************************/


                //...if the field is a section header, it should be added as info
                if($val->section_header !== '') {
                    $sectionInfo = $val->section_header;

                    $tex = $tex . '
                    \begin{info}
                        '.$sectionInfo.'
                    \end{info}';
                }

                $tex = $tex . '
                    \begin{info}
                        '.$entryInfo.'
                    \end{info}';
            }

            
            //...we don't support the field, skip to the next one
            else {
                continue;
            }
        }

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

    /**
     * Checks every element to ensure that grouped matrixes of questions
     * have been ended properly.
     * Just a function to eliminate the use of repeated code 
     */
}

?>