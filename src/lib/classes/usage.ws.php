<?php
/**
 * Produces a json encoded object of all the usage information in the database.
 * Includes the url, and if $ERROR is set, an error message.
 *
 * Requires that 5 factories be instantiated in the global environment.
 *    $HAZARDBASISFACTORY
 *    $DESIGNCODEFACTORY
 *    $REGIONFACTORY
 *    $SITECLASSFACTORY
 *    $RISKCATEGORYFACTORY
 *
 * Output:
 *    $USAGE
 */

$usage = array();

$usage['url'] = $MOUNT_PATH . 'ws/{design_code_id}/{site_class_id}/' .
    '{risk_category_id}/{longitude}/{latitude}/{title}';

try {
$usage['hazard_basis'] = $HAZARDBASISFACTORY.getAll();
$usage['design_code'] = $DESIGNCODEFACTORY->getAll();
$usage['region'] = $REGIONFACTORY->getAll();
$usage['site_class'] = $SITECLASSFACTORY->getAll();
$usage['risk_category'] = $RISKCATEGORYFACTORY->getAll();
}
catch (Exception $e) {
  if (is_array($ERROR)) {
    $ERROR['database_error'] = $e;
  } else if (is_set($ERROR)) {
    $ERROR = array(
      'error' => $ERROR,
      'database_error' => $e);
  } else {
    $ERROR = array('database_error' => $e);
  }
}

if (isset($ERROR)) {
  $usage['error'] = $ERROR;
}

$json = str_replace('\/', '/', json_encode($usage));
?>
