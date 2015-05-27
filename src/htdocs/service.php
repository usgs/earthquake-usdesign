<?php

/**
 * service.php services web queries.
 *   If no paramaters are passed in a usage message is sent back.
 *   If less then 6 parameters are passed in a usage and error message
 *      are sent back.
 *   If the correct 6 parameters are passed in a data message is sent back.
 *
 * Input:
 *  - title
 *  - latitude
 *  - longitude
 *  - design_code
 *  - risk_category
 *  - site_class
 *
 * Output:
 *  - JSON input/output format
 *
 */

include_once dirname(__FILE__) . '/../conf/config.inc.php';
include_once dirname(__FILE__) . '/../lib/install-funcs.inc.php';

include_once 'functions.inc.php';

$ERROR = null;

$param_count =  0;

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

// Only convert values if we're not missing values.
if ($param_count > 5) {
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
    if ($param_count === 0) {
      $ERROR = null;
    }
    include 'usage.ws.php';
  }
} catch (Exception $e) {
  $ERROR = $e->getMessage();
  include 'usage.ws.php';
}

function checkParamExists($param, $param_name) {
  global $ERROR;
  global $param_count;
  if ($param === null || $param == '') {
    if (isset($ERROR)) {
      $ERROR = $ERROR . ',' . $param_name;
    } else {
      $ERROR = 'Missing Parameter(s) ' . $param_name;
    }
  }
  else {
    $param_count += 1;
  }
}
