<?php

date_default_timezone_set('UTC');
// work from lib directory
chdir(dirname($argv[0]));

$CONFIG_FILE = '../conf/config.ini';

// Initial configuration stuff
if (!file_exists($CONFIG_FILE)) {
  print "$CONFIG_FILE not found. Please configure the application " .
      'before trying to set up the database. Configuration can be ' .
      "done as part of the installation process.\n";
  exit(-1);
}

include_once 'install-funcs.inc.php';
include_once '../conf/config.inc.php';

$dataDirectory = configure('DATA_DIR', $CONFIG['DATA_DIR'],
    'Enter directory where data files are located');

if (!file_exists($dataDirectory)) {
  print "\tThe indicated directory does not exist. Please try again.\n";
  exit(-1);
}

include_once 'classes/FileParser.class.php';

$parser = array();
$regionData = array();

$files = recursiveGlob($dataDirectory, '*.txt');

foreach ($files as $file) {
  // Create a parser for each file
  array_push($parser, new FileParser($file));
  array_push($regionData, "");
}

$errorCount = 0;
$eof = 0;

while($eof != 2) {
  $fileCount = 0;
  foreach ($files as $file) {
    $warnings = array();

    try {
      $regionData[$fileCount] = $parser[$fileCount]->nextLine($warnings);
      $latitude = $regionData[$fileCount]['latitude'];
      $longitude = $regionData[$fileCount]['longitude'];
      $value = $regionData[$fileCount]['value'];

      print "Lat: $latitude, Lon: $longitude, Value: $value, $stuff\n";
    } catch (Exception $e) {
      $warnings[] = $e->getMessage();
    }

    if (count($warnings) !== 0) {
      $errorCount += 1;
      print "The following warnings occurred while processing '${file}'\n  ";
      print implode("\n  ", $warnings) . "\n";
    }
    $fileCount += 1;
  }
  $eof += 1;
}

// Show an error summary in case user wasn't watching too closely.
print "\nProcessed " . count($files) . " files with " . $errorCount .
    " errors.";

if ($errorCount !== 0) {
  print " See above for details.\n";
} else {
  print "\n";
}

// ----------------------------------------------------------------------
// Done
// ----------------------------------------------------------------------

print "\nNormal exit.\n";
exit(0);
