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

$files = recursiveGlob($dataDirectory, '*.txt');
// TODO - Form $dataset using $files
include_once 'classes/SetParser.class.php';
$dataset = array(
  'geomean_ssd' => $dataDirectory . '\AK_DetGM1_downsample_0p01_to_0p05_trim_east_webtool.txt',
  'geomean_s1d' => $dataDirectory . '\AK_DetGM5_downsample_0p01_to_0p05_trim_east_webtool.txt',
  'crs' => $dataDirectory . '\AK_RC1_interp_0p1_to_0p05_trim_east_webtool.txt',
  'cr1' => $dataDirectory . '\AK_RC5_interp_0p1_to_0p05_trim_east_webtool.txt',
  'mapped_ss' => $dataDirectory . '\AK_UHGM1_interp_0p1_to_0p05_trim_east_webtool.txt',
  'mapped_s1' => $dataDirectory . '\AK_UHGM5_interp_0p1_to_0p05_trim_east_webtool.txt'
);

$populateDb = new SetParser($dataset);
$errorCount = $populateDb->process();

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
