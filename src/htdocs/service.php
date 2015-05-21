<?php

include_once dirname(__FILE__) . '/../conf/config.inc.php';
include_once dirname(__FILE__) . '/../lib/install-funcs.inc.php';

include_once 'functions.inc.php';

$ERROR = null;

$param_count = count($_GET);
if ($param_count > 0) {

  $design_code_id = safeintval(param('design_code_id', null));
  $site_class_id = safeintval(param('site_class_id', null));
  $risk_category_id = safeintval(param('risk_category_id', null));
  $longitude = safefloatval(param('longitude', null));
  $latitude = safefloatval(param('latitude', null));
  $title = param('title', null);

  checkParamExists($design_code_id, 'design_code_id');
  checkParamExists($site_class_id, 'site_class_id');
  checkParamExists($risk_category_id, 'risk_category_id');
  checkParamExists($longitude, 'longitude');
  checkParamExists($latitude, 'latitude');
  checkParamExists($title, 'title');
}


header('Content-Type: application/json');

try {
  if ($param_count > 0 && !isset($ERROR)) {
    include 'data.ws.php';
  } else {
    include 'usage.ws.php';
  }
} catch (Exception $e) {
  $ERROR = $e->getMessage();
  include 'usage.ws.php';
}

function checkParamExists($param, $param_name) {
  global $ERROR;
  if ($param === null) {
    if (isset($ERROR)) {
      $ERROR = $ERROR . ',' . $param_name;
    } else {
      $ERROR = 'Missing Parameter(s) ' . $param_name;
    }
  }
}
