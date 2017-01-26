<?php
/**
 * Produces a json encoded object of all the usage information in the database.
 * Includes the url, and if $ERROR is set, an error message.
 *
 * Requires that 5 factories be instantiated in the global environment.
 *    $hazardBasisFactory
 *    $designCodeFactory
 *    $regionFactory
 *    $siteClassFactory
 *    $riskCategoryFactory
 *
 * Output:
 *    $USAGE
 */

include_once '../conf/config.inc.php';
header('Content-Type: application/json'); // TODO :: Remove this when service.php sets it
$usage = array();

$server_protocol = (
  (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'Off') ||
  (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
      $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
  ? 'https://' : 'http://');

$usage['url'] = ($server_protocol .
    $_SERVER['HTTP_HOST'] . $MOUNT_PATH .
    '/ws/{design_code_id}/{site_class_id}/{risk_category_id}/' .
    '{longitude}/{latitude}/{title}');

try {
  $usage['hazard_basis'] = $hazardBasisFactory->getAll();
  $usage['design_code'] = $designCodeFactory->getAll();
  $usage['region'] = $regionFactory->getAll();
  $usage['site_class'] = $siteClassFactory->getAll();
  $usage['risk_category'] = $riskCategoryFactory->getAll();
} catch (Exception $e) {
  if (isset($ERROR)) {
    if (is_array($ERROR)) {
      $ERROR[] = $e->getMessage();
    } else {
      $ERROR = array($ERROR, $e->getMessage());
    }
  } else {
    $ERROR = $e->getMessage();
  }
}

if (isset($ERROR)) {
  $usage['error'] = $ERROR;
}

print str_replace('\/', '/', json_encode($usage));
