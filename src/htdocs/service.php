<?php

include_once dirname(__FILE__) . '/../conf/config.inc.php';
// include_once 'functions.inc.php';

$ERROR = null;

$param_count = count($_GET);
if ($param_count > 0) {

  $design_code_id = param('design_code_id', null);
  $site_class_id = param('site_class_id', null);
  $risk_category_id = param('risk_category_id', null);
  $longitude = param('longitude', null);
  $latitude = param('latitude', null);
  $title = param('title', null);

  checkParamExists($design_code_id, 'design_code_id');
  checkParamExists($site_class_id, 'site_class_id');
  checkParamExists($risk_category_id, 'risk_category_id');
  checkParamExists($longitude, 'longitude');
  checkParamExists($latitude, 'latitude');
  checkParamExists($title, 'title');
}


header('Content-Type: application/json');

if ($param_count === 0 || isset($ERROR)) {
  include_once dirname(__FILE__) . '/usage.ws.php';
}
else {
  include_once dirname(__FILE__) . '/data.ws.php';
}

function checkParamExists($param, $param_name) {
  global $ERROR;
  if ($param === null) {
    if (isset($ERROR)) {
      $ERROR = $ERROR . ',' . $param_name;
    }
    else {
      $ERROR = 'Missing Parameter(s) ' . $param_name;
    }
  }
}

?>
