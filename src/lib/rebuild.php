<?php

$CONFIG = parse_ini_file('../conf/config.ini');
$DATA_DIR = $CONFIG['DATA_DIR'];
$SCRIPT_DIR = $CONFIG['SCRIPT_DIR'];
$REMOTE_SCRIPT_URL = "https://geohazards.usgs.gov/trac/raw-attachment/wiki/NSHMP/design/RawData/";

print "Note that the application data are loaded via SQL scripts stored on a " .
		"remote server. Loading these data may take upwards of several hours.\n".
		"Here are some problems (with suggested solutions) that you " .
		"may run into when loading the application data:\n\n";

print "1. Can't connect to the scripts over SSL -- uncomment " .
		"'extension=php_openssl.dll' in php.ini.\n"; 
print "2. PHP gives you an out of memory area -- " .
		"set 'memory_limit=128' to a higher value in php.ini.\n"; 
print "3. You get a 'DDL error: SQLSTATE[HY000]:  General error: 7 server " .
		"closed the connection unexpectedly' message --\nadjust the network " .
		"and/or database timeout settings to allow for longer connections.\n\n";
print "Press return to continue ";
fgets(STDIN);
  
print "Database writer user: ";
$DB_WRITE_USER = trim(fgets(STDIN));
print "Database writer password: ";
$DB_WRITE_PASSWORD = trim(fgets(STDIN));

// Connect to database
$DB = null;
$dsn = sprintf("%s:host=%s;dbname=%s",
		$CONFIG['DB_DRIVER'],
		$CONFIG['DB_HOST'],
		$CONFIG['DB_NAME']);
try {
	$DB = new PDO($dsn, $DB_WRITE_USER, $DB_WRITE_PASSWORD, array (
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
	));
} catch (PDOException $e) {
	// Couldn't connect to database
	trigger_error("Problem connecting to the database: " . $e->getMessage());
	exit();
}

$SCHEMA = strtoupper($CONFIG['DB_SCHEMA']);	

// Quick check for existing tables (verify overwrite)
try {
	$results = $DB->query('SELECT 1 FROM ' . $SCHEMA . '.data LIMIT 1');
	print "\nIt appears that the application data objects already exist.  Do " .
			"you want to recreate all application objects (cannot be undone)?\n";
	print 'Enter "Yes" or "No" [No]: ';
	$verify = trim(fgets(STDIN));
	print "\n";
	if (strtoupper($verify) != "YES") {
		print "Build of application data objects cancelled\n";
		$DB = null;
		exit();
	}
} catch (PDOException $e) {}

print "Creating tables and views ...\n";
$sql = file_get_contents($SCRIPT_DIR . '/structure.sql');

// If schema is not the default, modify it in the commands.
if ($SCHEMA !== 'US_DESIGN') {
	$sql = str_ireplace('US_DESIGN', $SCHEMA, $sql);
}
try {
	$DB->exec($sql);
}
catch (PDOException $e) {
		trigger_error("DDL error: " . $e->getMessage());
}

print "Creating PL/SQL functions ...\n";
$sql = file_get_contents($SCRIPT_DIR . '/tsubl_value.sql');

// If schema is not the default, modify it in the commands.
if ($SCHEMA !== 'US_DESIGN') {
	$sql = str_ireplace('US_DESIGN', $SCHEMA, $sql);
}

try {
	$DB->exec($sql);
}
catch (PDOException $e) {
	trigger_error("DDL error: " . $e->getMessage());
}

print "Loading lookup table data ...\n";
$sql = file_get_contents($SCRIPT_DIR . '/data.sql');

// If schema is not the default, modify it in the commands.
if ($SCHEMA !== 'US_DESIGN') {
	$sql = str_ireplace('US_DESIGN', $SCHEMA, $sql);
}

try {
	$DB->exec($sql);
}
catch (PDOException $e) {
	trigger_error("DDL error: " . $e->getMessage());
}

// Check for the TSUBL layer.
try {
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$results = $DB->query('SELECT 1 FROM ' . $SCHEMA . '.tsubl LIMIT 1');
} catch (PDOException $e) {
	print "\nWarning: To complete the installation, you need to use ArcMap " .
			"or a similar tool from ESRI to load the TsubL geodatabase (at " .
			$DATA_DIR . "/TsubL1.gdb.zip) into an SDE layer named " .
			$SCHEMA . ".TSUBL\n\n";
}

/*
 * Load the list of remote application data scripts and iterate through them.
 * To minimize the risk of network/database timeouts, reconnect for each script.
 */
$scripts = file($SCRIPT_DIR . '/remote_sql_scripts.txt', FILE_IGNORE_NEW_LINES);
foreach ($scripts as $script) {
	$DB = null;
	if (substr($script,0,2) === "//") {
		continue;
	}
	$sql = file_get_contents($REMOTE_SCRIPT_URL . $script);
	print $script . "\n";

	// If schema is not the default, modify it in the commands.
	if ($SCHEMA !== 'US_DESIGN') {
		$sql = str_ireplace('US_DESIGN', $SCHEMA, $sql);
	}

	try {
		$DB = new PDO($dsn, $DB_WRITE_USER, $DB_WRITE_PASSWORD, array (
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
		));
		$DB->exec($sql);
	}
	catch (PDOException $e) {
		trigger_error("DDL error: " . $e->getMessage());
	}
}

$DB = null;
?>
