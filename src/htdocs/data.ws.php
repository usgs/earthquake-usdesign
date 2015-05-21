<?php
// TODO, remove, will be set from $_GET variables in service.php
$title = 'My First Report';
$latitude = 65;
$longitude = -150;
$design_code_id = 1;
$risk_category = 1;
$site_class = 1;

/**
 * data.ws.php queries the database for the corresponding
 * grid points and data.
 *
 * Input:
 *  - title
 *  - latitude
 *  - longitude
 *  - design_code_id
 *  - risk_category
 *  - site_class
 *
 * Output:
 *  - JSON input/output format
 *
 */

include_once '../conf/config.inc.php';


$region = $regionFactory->get($latitude, $longitude, $design_code_id);
$data = $dataFactory->get($latitude, $longitude, $region);

// object containing metadata from region factory
$metadata = array(
  "max_direction_ss" => $region['max_direction_ss'],
  "max_direction_s1" => $region['max_direction_s1'],
  "percentile_ss" => $region['percentile_ss'],
  "percentile_s1" => $region['percentile_s1'],
  "deterministic_floor_ss" => $region['deterministic_floor_ss'],
  "deterministic_floor_s1" => $region['deterministic_floor_s1'],
  "grid_spacing" => $region['grid_spacing']
);

// object containing output from region and data factories
$output = array(
  "data" => $data,
  "metadata" => $metadata,
  "tl" => $tl
);

// object with input parameters
$input = array(
  "title" => $title,
  "latitude" => $latitude,
  "longitude" => $longitude,
  "design_code" => $design_code_id,
  "risk_category" => $risk_category,
  "site_class" => $site_class
);

// wraps input/output objects
print json_encode(array(
  "input" => $input,
  "output" => $output
));
