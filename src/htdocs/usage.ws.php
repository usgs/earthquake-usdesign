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

$usage['url'] = $MOUNT_PATH . '/ws/{design_code_id}/{site_class_id}/' .
    '{risk_category_id}/{longitude}/{latitude}/{title}';

try {
  $usage['hazard_basis'] = $HAZARDBASISFACTORY->getAll();
  $usage['design_code'] = $DESIGNCODEFACTORY->getAll();
  $usage['region'] = $REGIONFACTORY->getAll();
  $usage['site_class'] = $SITECLASSFACTORY->getAll();
  $usage['risk_category'] = $RISKCATEGORYFACTORY->getAll();
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

$json = str_replace('\/', '/', json_encode($usage));
?>
