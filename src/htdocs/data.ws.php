<?php
/**
 * data.ws.php queries the database for the corresponding
 * grid points and data.
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

include_once '../conf/config.inc.php';


$region = $regionFactory->get($latitude, $longitude, $design_code_id);
$data = $dataFactory->get($latitude, $longitude, $region);
$tl = $dataFactory->computeTL($latitude, $longitude);

// object containing metadata from region factory
$metadata = array(
  'region_name' => $region['name'],
  'region_id' => $region['id'],
  'max_direction_ss' => $region['max_direction_ss'],
  'max_direction_s1' => $region['max_direction_s1'],
  'percentile_ss' => $region['percentile_ss'],
  'percentile_s1' => $region['percentile_s1'],
  'percentile_pga' => $region['percentile_pga'],
  'deterministic_floor_ss' => $region['deterministic_floor_ss'],
  'deterministic_floor_s1' => $region['deterministic_floor_s1'],
  'deterministic_floor_pga' => $region['deterministic_floor_pga'],
  'grid_spacing' => $region['grid_spacing']
);

// object containing output from region and data factories
$output = array(
  'data' => $data,
  'metadata' => $metadata,
  'tl' => $tl
);

// object with input parameters
$input = array(
  'title' => $title,
  'latitude' => $latitude,
  'longitude' => $longitude,
  'design_code' => $design_code_id,
  'risk_category' => $risk_category_id,
  'site_class' => $site_class_id
);

// wraps input/output objects
print json_encode(array(
  'input' => $input,
  'output' => $output
));
