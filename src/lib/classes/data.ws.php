<?php

// TODO, remove, the following variables will be set in the service wrapper
$latitude = 65;
$longitude = -150;
$design_code_id = 1;

include_once dirname(__FILE__) . '/DataFactory.class.php';
include_once dirname(__FILE__) . '/RegionFactory.class.php';

$DataFactory = new DataFactory($DB);
$RegionFactory = new RegionFactory($DB);

$region = $RegionFactory->get($latitude, $longitude, $design_code_id);
$data = $DataFactory->get($latitude, $longitude, $region);

$data = json_encode($data);
