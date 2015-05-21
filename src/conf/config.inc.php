<?php

date_default_timezone_set('UTC');

$CONFIG = parse_ini_file('config.ini');

$APP_DIR = $CONFIG['APP_DIR'];
$DATA_DIR = $CONFIG['DATA_DIR'];
$MOUNT_PATH = $CONFIG['MOUNT_PATH'];

// Using NO_DB guard allows pages that do not need database connection to use
// this same configuration file without adding in database overhead.
if (!(isset($NO_DB) && $NO_DB)) {
  $DB = new PDO($CONFIG['DB_DSN'], $CONFIG['DB_USER'], $CONFIG['DB_PASS']);
  $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if (isset($CONFIG['DB_SCHEMA'])) {
    $DB->exec('SET search_path = ' . $CONFIG['DB_SCHEMA'] . ', public');
  }

  include_once '../lib/classes/HazardBasisFactory.class.php';
  include_once '../lib/classes/DesignCodeFactory.class.php';
  include_once '../lib/classes/RegionFactory.class.php';
  include_once '../lib/classes/SiteClassFactory.class.php';
  include_once '../lib/classes/LookupDataFactory.class.php';

  $hazardBasisFactory = new HazardBasisFactory($DB);
  $designCodeFactory = new DesignCodeFactory($DB);
  $regionFactory = new RegionFactory($DB);
  $siteClassFactory = new SiteClassFactory($DB);
  $riskCategoryFactory = new LookupDataFactory($DB, 'risk_category');
}
