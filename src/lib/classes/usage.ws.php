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

$usageArray = array();

$usageArray['url'] = $MOUNT_PATH . 'ws/{design_code_id}/{site_class_id}/' .
    '{risk_category_id}/{longitude}/{latitude}/{title}';
if (isset($ERROR)) {
  $usageArray['error'] = $ERROR;
}
// $usageArray['hazard_basis'] = $HAZARDBASISFACTORY.getAll();
$usageArray['design_code'] = $DESIGNCODEFACTORY->getAll();
$usageArray['region'] = $REGIONFACTORY->getAll();
$usageArray['site_class'] = $SITECLASSFACTORY->getAll();
$usageArray['risk_category'] = $RISKCATEGORYFACTORY->getAll();

$USAGE = str_replace('\/', '/', json_encode($usageArray));
?>
