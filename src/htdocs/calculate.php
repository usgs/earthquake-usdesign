<?php

if (!isset($_REQUEST['edition_id']) || !isset($_REQUEST['site_soil_class_id'])
		|| !isset($_REQUEST['latitude']) ||!isset($_REQUEST['longitude'])) {
	header('HTTP/1.1 400 Bad Request');
	echo 'edition_id, site_soil_class_id, latitude, and longitude are required';
	exit();
}

$edition_id = intval($_REQUEST['edition_id']);
$site_soil_class_id = intval($_REQUEST['site_soil_class_id']);
if ($edition_id <= 0 || $site_soil_class_id <= 0) {
	header('HTTP/1.1 400 Bad Request');
	echo 'edition_id and site_soil_class_id must be positive integers';
	exit();
}

$latitude = $_REQUEST['latitude'];
$longitude = $_REQUEST['longitude'];
if (!is_numeric($latitude) || !is_numeric($longitude)) {
	header('HTTP/1.1 400 Bad Request');
	echo 'latitude and longitude must be numeric';
	exit();
}

$risk_category_id = null;
if (isset($_REQUEST['risk_category_id'])) {
	$risk_category_id = intval($_REQUEST['risk_category_id']);
	if ($risk_category_id <= 0) {
		header('HTTP/1.1 400 Bad Request');
		echo 'optional risk_category_id must be a positive integer';
		exit();
	}
}

$design_code_variant_id = null;
if (isset($_REQUEST['design_code_variant_id'])) {
	$design_code_variant_id = intval($_REQUEST['design_code_variant_id']);
	if ($design_code_variant_id <= 0) {
		header('HTTP/1.1 400 Bad Request');
		echo 'optional design_code_variant_id must be a positive integer';
		exit();
	}
}

// load config after ensuring required parameter is present
include_once '../conf/config.inc.php';

// process request
try {
	// Include the input parameters
	$json = '{"edition_id":' . $edition_id;
	$json .= ',"site_soil_class_id":' . $site_soil_class_id;
	$json .= ',"latitude":' . $latitude;
	$json .= ',"longitude":' . $longitude;
	if (!is_null($risk_category_id)) { 
		$json .= ',"risk_category_id":' . $risk_category_id;
	}
	if (!is_null($design_code_variant_id)) { 
		$json .= ',"design_code_variant_id":' . $design_code_variant_id;
	}

	// Get the data needed by the calculater
	$lat = doubleval($latitude);
	$lon = doubleval($longitude);
	$json .= ',"tsubl":' .
			json_encode($DATA_FACTORY->getTsubLForPoint($lon, $lat));
	$dataset = $DATA_FACTORY->getDatasetForPointAndEdition($lon, $lat,
			$edition_id, $design_code_variant_id);
	$json .= ',"dataset":' . json_encode($dataset);
	$json .= ',"data":' . json_encode($DATA_FACTORY->
			getDataForPointAndDatasetObject($lon, $lat, $dataset)) . "}";

	if (isset($_REQUEST['callback'])) {
		header('Content-Type: text/javascript');
		echo $_REQUEST['callback'] . '(' . $json . ');';
	} else {
		header('Content-Type: application/json');
		echo $json;
	}
} catch (Exception $e) {
	// fail noisily
	header('HTTP/1.1 500 Internal Server Error');

	// log the error
	error_log($e->getMessage());

	exit();
}

