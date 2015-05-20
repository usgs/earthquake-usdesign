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
}
