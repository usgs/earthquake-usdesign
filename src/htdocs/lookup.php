<?php

include_once '../conf/config.inc.php';

// process request
try {
	
	$json = '{"data_source":' . str_replace('\"', '"', json_encode($LOOKUP_FACTORY->
			getDataSources()));
	$json .= ',"edition":' .
			json_encode($LOOKUP_FACTORY->getEditions());
	$json .= ',"site_soil_class":' .
			json_encode($LOOKUP_FACTORY->getSiteSoilClasses());
	$json .= ',"design_code_variant":' .
			json_encode($LOOKUP_FACTORY->getDesignCodeVariants());
	$json .= ',"region":' .
			json_encode($LOOKUP_FACTORY->getRegions());
	$json .= ',"ftable":' .
			json_encode($TABLE_FACTORY->getFTables());
	$json .= ',"risk_table":' .
			json_encode($TABLE_FACTORY->getRiskTables()) . '}';
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

