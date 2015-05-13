<?php

date_default_timezone_set('UTC');
print "Remove - START\n";
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
print "Remove - File Exists\n";

include_once 'install-funcs.inc.php';
include_once '../conf/config.inc.php';
print "Remove - Includes OK\n";

$dataDirectory = configure('DATA_DIR', $CONFIG['DATA_DIR'],
    'Enter directory where data files are located');
print "Remove - Data Dir: $dataDirectory\n";

if (!file_exists($dataDirectory)) {
  print "\tThe indicated directory does not exist. Please try again.\n";
  exit(-1);
}
print "Remove - Directory Exists\n";

include_once 'classes/FileParser.class.php';
print "Remove - Parser Included\n";
$parser = new FileParser();
print "Remove - Parser Created\n";

$files = recursiveGlob($dataDirectory, '*.txt');
// print("Files: $files");
$errorCount = 0;

foreach ($files as $file) {
  $warnings = array();

  try {
    print "Remove - File: $file, Warnings: $warnings\n";
    $regionData = $parser->parse($file, $warnings);
    print "Remove - Region Data Set\n";
  } catch (Exception $e) {
    $warnings[] = $e->getMessage();
  }

  if (count($warnings) !== 0) {
    $errorCount += 1;
    print "The following warnings occurred while processing '${file}'\n  ";
    print implode("\n  ", $warnings) . "\n";
  }
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
