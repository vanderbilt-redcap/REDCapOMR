<form action="/action_page.php">
  <input type="file" id="myFile" name="filename" accept=".jpg,.jpeg,.png,.tiff,.tif,.pdf">
  <input type="submit">
</form>

<?php

require_once("requires/json2latex.php");

echo $temp = sys_get_temp_dir();

$json1 = json_decode(file_get_contents('metadata.json')); 
$json2 = json_decode(file_get_contents('metadata.json'), true);
$json3 = file_get_contents('metadata.json');

$tex = json2latex::createHeader($json3);
$tex = json2latex::createBody($tex, $json3);
$tex = json2latex::createFooter($tex);

echo $tex . '<br><br>';

file_put_contents('testtex.tex', $tex);

//Make array of answers
$choices = explode('|', $json1[4]->select_choices_or_calculations);
//Remove all numeric characters so only description is shown
$choices = preg_replace('/[0-9]+/', '', $choices);
//Remove all commas
$choices = str_replace(',', '', $choices);
//Trim all white space from each choice
foreach($choices as $key => $choice) {
    $choices[$key] = trim($choice);
}

echo var_dump($choices);

echo $json1[4]->field_label . '<br><br>';

$title = $json1[0]->form_name;
$title = str_replace("_", " ", $title);
$title = ucwords($title);
        
echo $title.'<br><br>';

echo '<pre>';
var_dump($json2);
echo '</pre>';

foreach ($json1 as $value) {
  foreach($value as $k => $v) {
    echo '<b>'. $k . '</b>'. ': ' . $v . '<br>';
  }
  echo '<br>';
}

?>