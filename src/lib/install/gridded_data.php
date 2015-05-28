<?php

// DATASET CONFIGURATION
$remote_server = 'hazards.cr.usgs.gov';

$datasets = array(
  '2015nehrp_alaska' => array(
    'title' => '2015 NEHRP Alaska',
    'design_code_id' => 1,
    'metadata_id' => 1,
    'name' => 'Alaska',
    'min_latitude' => 48.00,
    'max_latitude' => 72.00,
    'min_longitude' => -200.00,
    'max_longitude' => -125.10,
    'grid_spacing' => 0.05,
    'remote_dir' => '/web/earthquake-usdesign/2015nehrp/alaska'
  ),
  '2015nehrp_amsam' => array(
    'title' => '2015 NEHRP American Samoa',
    'design_code_id' => 1,
    'metadata_id' => 2,
    'name' => 'American Samoa',
    'min_latitude' => -33.00,
    'max_latitude' => -11.00,
    'min_longitude' => -195.00,
    'max_longitude' => -165.10,
    'grid_spacing' => 0.10,
    'remote_dir' => '/web/earthquake-usdesign/2015nehrp/amsam'
  ),
  '2015nehrp_guam' => array(
    'title' => '2015 NEHRP Guam',
    'design_code_id' => 1,
    'metadata_id' => 2,
    'name' => 'Guam',
    'min_latitude' => 9.00,
    'max_latitude' => 23.00,
    'min_longitude' => 139,
    'max_longitude' => 151,
    'grid_spacing' => 0.10,
    'remote_dir' => '/web/earthquake-usdesign/2015nehrp/guam'
  ),
  '2015nehrp_hv' => array(
    'title' => '2015 NEHRP Hawaii',
    'design_code_id' => 1,
    'metadata_id' => 3,
    'name' => 'Hawaii',
    'min_latitude' => 18.00,
    'max_latitude' => 23.00,
    'min_longitude' => -161,
    'max_longitude' => -154,
    'grid_spacing' => 0.02,
    'remote_dir' => '/web/earthquake-usdesign/2015nehrp/hi'
  ),
  '2015nehrp_prvi' => array(
    'title' => '2015 NEHRP Puerto Rico/Virgin Islands',
    'design_code_id' => 1,
    'metadata_id' => 1,
    'name' => 'Puerto Rico and Virgin Islands',
    'min_latitude' => 17.50,
    'max_latitude' => 19.00,
    'min_longitude' => -67.50,
    'max_longitude' => -64.50,
    'grid_spacing' => 0.02,
    'remote_dir' => '/web/earthquake-usdesign/2015nehrp/prvi'
  ),
  '2015nehrp_us' => array(
    'title' => '2015 NEHRP Conterminous US',
    'design_code_id' => 1,
    'metadata_id' => 2,
    'name' => 'Conterminous US',
    'min_latitude' => 24.60,
    'max_latitude' => 50.00,
    'min_longitude' => -125.00,
    'max_longitude' => -65.10,
    'grid_spacing' => 0.05,
    'remote_dir' => '/web/earthquake-usdesign/2015nehrp/us'
  )
);


chdir(dirname(__FILE__));

include_once '../install-funcs.inc.php';
include_once '../classes/DataFactory.class.php';
include_once '../classes/RegionFactory.class.php';
include_once '../classes/SetParser.class.php';

// get or reuse admin database credentials
if (!isset($DB_DSN) || !isset($username) || !isset($password)) {
  include_once '../../conf/config.inc.php';
  $DB_DSN = configure('DB_ROOT_DSN', $CONFIG['DB_DSN'],
      'Database administrator DSN');
  $username = configure('DB_ROOT_USER', 'root', 'Database adminitrator user');
  $password = configure('DB_ROOT_PASS', '', 'Database administrator password',
      true);
}

$DB = new PDO($DB_DSN, $username, $password);
$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
if (isset($CONFIG['DB_SCHEMA'])) {
  $DB->exec('SET search_path = ' . $CONFIG['DB_SCHEMA'] . ', public');
}

$dataFactory = new DataFactory($DB);
$regionFactory = new regionFactory($DB);


// local data directory
$local_dir = sys_get_temp_dir() . '/earthquake-usdesign-data';
if (!is_dir($local_dir)) {
  mkdir($local_dir);
}


// connect to ftp server
$ftp = ftp_connect($remote_server);
ftp_login($ftp, 'anonymous', 'earthquake-usdesign@usgs.gov');


// loop over editions
$anyErrors = false;
foreach ($datasets as $id => $metadata) {
  // check whether to load dataset
  $region = $regionFactory->get(
      ($metadata['min_latitude'] + $metadata['max_latitude']) / 2,
      ($metadata['min_longitude'] + $metadata['max_longitude']) / 2,
      $metadata['design_code_id']);
  if ($region !== null) {
    // already exists, make sure user want's to replace
    if (!promptYesNo($metadata['title'] . ' already exists,' .
        ' replace existing data?', false)) {
      continue;
    }
  } else if (!promptYesNo('Load ' . $metadata['title'] . '?', true)) {
    continue;
  }

  $DB->beginTransaction();
  try {
    if ($region !== null) {
      // remove existing data
      $dataFactory->delete($region);
    } else {
      // does not exist, insert
      $regionFactory->insert($metadata['design_code_id'],
          $metadata['metadata_id'], $metadata['name'],
          $metadata['min_latitude'], $metadata['max_latitude'],
          $metadata['min_longitude'], $metadata['max_longitude'],
          $metadata['grid_spacing']);
      // get inserted region
      $region = $regionFactory->get(
          ($metadata['min_latitude'] + $metadata['max_latitude']) / 2,
          ($metadata['min_longitude'] + $metadata['max_longitude']) / 2,
          $metadata['design_code_id']);
    }

    // download dataset
    echo "\t" . 'downloading ...';
    $local_dataset = $local_dir . '/' . $id;
    if (!is_dir($local_dataset)) {
      mkdir($local_dataset);
    }
    $remote_dataset = $metadata['remote_dir'];
    // loop over dataset files
    $files = ftp_nlist($ftp, $remote_dataset);
    foreach ($files as $remote_file) {
      $file = basename($remote_file);
      $local_file = $local_dataset . '/' . $file;
      ftp_get($ftp, $local_file, $remote_file, FTP_BINARY);

      // unzip if needed
      $ext = pathinfo($local_file, PATHINFO_EXTENSION);
      if ($ext === 'zip') {
        unzipFile($local_file, true);
      }
    }
    echo ' success!' . PHP_EOL;

    // load dataset files into database
    echo "\t" . 'loading ...';
    // check that files exist
    $cr1 = $local_dataset . '/mapped_cr1.txt';
    $crs = $local_dataset . '/mapped_crs.txt';
    $pga = $local_dataset . '/mapped_pga.txt';
    $pgad = $local_dataset . '/mapped_pgad.txt';
    $s1 = $local_dataset . '/mapped_s1.txt';
    $ss = $local_dataset . '/mapped_ss.txt';
    $s1d = $local_dataset . '/mapped_s1d.txt';
    $ssd = $local_dataset . '/mapped_ssd.txt';

    if (!file_exists($cr1)) {
      throw new Exception('Missing file mapped_cr1.txt');
    } else if (!file_exists($crs)) {
      throw new Exception('Missing file mapped_crs.txt');
    } else if (!file_exists($pga)) {
      throw new Exception('Missing file mapped_pga.txt');
    } else if (!file_exists($pgad)) {
      throw new Exception('Missing file mapped_pgad.txt');
    } else if (!file_exists($s1)) {
      throw new Exception('Missing file mapped_s1.txt');
    } else if (!file_exists($ss)) {
      throw new Exception('Missing file mapped_ss.txt');
    } else if (!file_exists($s1d)) {
      throw new Exception('Missing file mapped_s1d.txt');
    } else if (!file_exists($ssd)) {
      throw new Exception('Missing file mapped_ssd.txt');
    }

    $dataset = array(
      'cr1' => $cr1,
      'crs' => $crs,
      'geomean_pgad' => $pgad,
      'geomean_s1d' => $s1d,
      'geomean_ssd' => $ssd,
      'mapped_pga' => $pga,
      'mapped_s1' => $s1,
      'mapped_ss' => $ss
    );

    // parse dataset files
    $parser = new SetParser($dataset, $region, $dataFactory);
    $parser->process();

    // successfully processed, commit
    $DB->commit();
    echo ' success!' . PHP_EOL;
  } catch (Exception $e) {
    // something went wrong, rollback
    $DB->rollBack();
    echo PHP_EOL .
        PHP_EOL .
        'ERROR: Unable to load ' . $metadata['title'] . ' (downloaded from' .
            ' ftp://' . $remote_server . $remote_dataset . ')' . PHP_EOL .
        'ERROR: ' . $e->getMessage() . PHP_EOL .
        PHP_EOL;

    $anyErrors = true;
  }
}

if ($anyErrors) {
  echo PHP_EOL . 'There were errors loading datasets,' .
      ' check the output above for more information.' . PHP_EOL;
  exit(-1);
}
