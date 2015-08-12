<?php
// This script prompts user if they would like to set up the database this
// includes the following steps.
//
// (1) Create the database schema
//     (1.1) If initially answering yes, notify current content may be
//           destroyed.
//     (1.2) Load reference data
// (2) Create user
// (3) Grant access to user
// (4) Load gridded data.
//

date_default_timezone_set('UTC');

include_once 'install-funcs.inc.php';
include_once 'install/DatabaseInstaller.class.php';


$DB_DSN = configure('DB_ROOT_DSN', $CONFIG['DB_DSN'],
    'Database administrator DSN');
$username = configure('DB_ROOT_USER', 'root', 'Database adminitrator user');
$password = configure('DB_ROOT_PASS', '', 'Database administrator password',
    true);
$defaultScriptDir = implode(DIRECTORY_SEPARATOR, array(
    $APP_DIR, 'lib', 'install', 'sql'));

// ----------------------------------------------------------------------
// Schema loading configuration
// ----------------------------------------------------------------------


$dbInstaller = new DatabaseInstaller($DB_DSN, $username, $password,
    $CONFIG['DB_SCHEMA']);
$dbInstaller->enablePostgis();

try {
  echo PHP_EOL;
  $answer = promptYesNo('Would you like to create the database schema?', true);
  if ($answer) {
    $answer = promptYesNo(PHP_EOL .
        'Loading the schema removes any existing schema and/or data!' . PHP_EOL .
        'Are you sure you wish to continue?', false);
    if ($answer) {
      // ----------------------------------------------------------------------
      // Create Schema
      // ----------------------------------------------------------------------
      $createTablesScript = promptFile(
          'SQL script containing "create" schema definition',
          $defaultScriptDir . DIRECTORY_SEPARATOR . 'create_tables.sql');
      $dropTablesScript = promptFile(
          'SQL script containing "drop" schema definition',
          $defaultScriptDir . DIRECTORY_SEPARATOR . 'drop_tables.sql');

      echo 'Loading schema ...';
      // run create schema
      $dbInstaller->createSchema();
      // drop tables
      $dbInstaller->runScript($dropTablesScript);
      // create tables
      $dbInstaller->runScript($createTablesScript);
      echo ' success!' . PHP_EOL . PHP_EOL;

      // Enable postgis
      $answer = promptYesNo('Would you like to enable postgis?', false);
      if ($answer) {
        $dbInstaller->enablePostgis();
      }

      // ----------------------------------------------------------------------
      // Load Reference Data
      // ----------------------------------------------------------------------
      $answer = promptYesNo(
          'Would you like to load the reference data into the database?', true);
      if ($answer) {
        $referenceDataScript = promptFile(
            'SQL script contiaining reference data',
            $defaultScriptDir . DIRECTORY_SEPARATOR . 'reference_data.sql');

        echo 'Loading reference data ...';
        $dbInstaller->runScript($referenceDataScript);
        echo ' success' . PHP_EOL . PHP_EOL;
      }
    }
  }

  // ----------------------------------------------------------------------
  // Create User
  // ----------------------------------------------------------------------
  $answer = promptYesNo('Would you like to create the read-only' .
      ' database user (' . $CONFIG['DB_USER'] . ')?', true);
  if ($answer) {
    echo 'Creating read-only user ...';
    try {
      $dbInstaller->createUser($CONFIG['DB_USER'], $CONFIG['DB_PASS']);
      echo ' success!' . PHP_EOL;
    } catch (Exception $e) {
      $message = $e->getMessage();
      if (strpos($message, 'user already exists') === -1) {
        throw $e;
      }
      echo ' user already exists!' . PHP_EOL;
    }
  }

  echo 'Granting access to read-only user ...';
  // always grant usage in case user already exists
  $dbInstaller->grantUsage(array('SELECT'), $CONFIG['DB_USER']);
  echo ' success!' . PHP_EOL . PHP_EOL;

  // save changes
  $dbInstaller->commit();
} catch (Exception $e) {
  echo 'ERROR: ' . $e->getMessage() . PHP_EOL;
  echo 'ERROR: Rolling back database transaction...' . PHP_EOL;
  $dbInstaller->rollBack();
  exit(-1);
}


// ----------------------------------------------------------------------
// US Design gridded data
// ----------------------------------------------------------------------
$answer = promptYesNo(
    'Would you like to load the gridded data into the database?', true);
if ($answer) {
    // load data
    include_once('install/gridded_data.php');
}


// ----------------------------------------------------------------------
// End of database setup
// ----------------------------------------------------------------------

echo "\nNormal exit.\n";
exit(0);
