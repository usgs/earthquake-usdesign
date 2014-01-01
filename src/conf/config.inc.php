<?php

// set default timezone
date_default_timezone_set('UTC');


// read configuration
$CONFIG = parse_ini_file('config.ini');
$APP_DIR = $CONFIG['APP_DIR'];
$DATA_DIR = $CONFIG['DATA_DIR'];
$MOUNT_PATH = $CONFIG['MOUNT_PATH'];

include_once $APP_DIR . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR .
		'lib.inc.php';

// connect to database
$DB = null;
$dsn = sprintf("%s:host=%s;dbname=%s",
		$CONFIG['DB_DRIVER'],
		$CONFIG['DB_HOST'],
		$CONFIG['DB_NAME']);
try {
	$DB = new PDO($dsn, $CONFIG['DB_READ_USER'], $CONFIG['DB_READ_PASSWORD']);
} catch (PDOException $e) {
	// Couldn't connect to database
	trigger_error("Problem connecting to the database: " . $e->getMessage());
}

$LOOKUP_FACTORY = new LookupFactory($DB);
// $DATA_FACTORY = new DataFactory($DB);
// $TABLE_FACTORY = new TableFactory($DB);
?>
