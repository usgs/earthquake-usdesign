<?php

include_once dirname(__FILE__) . '/../conf/config.inc.php';
include_once dirname(__FILE__) . '/../lib/install-funcs.inc.php';

include_once 'functions.inc.php';

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

  $design_code_id = safeintval($design_code_id);
  $site_class_id = safeintval($site_class_id);
  $risk_category_id = safeintval($risk_category_id);
  $longitude = safefloatval($longitude);
  $latitude = safefloatval($latitude);
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
  if ($param === null || $param == '') {
    if (isset($ERROR)) {
      $ERROR = $ERROR . ',' . $param_name;
    } else {
      $ERROR = 'Missing Parameter(s) ' . $param_name;
    }
  }
}
