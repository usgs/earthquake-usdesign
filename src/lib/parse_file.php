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

// Separate below this
// include_once 'classes/FileParser.class.php';

include_once 'classes/SetParser.class.php';
$dataset = array(
  'geomean_ssd' => $dataDirectory . '\AK_DetGM1_downsample_0p01_to_0p05_trim_east_webtool.txt',
  'geomean_s1d' => $dataDirectory . '\AK_DetGM5_downsample_0p01_to_0p05_trim_east_webtool.txt',
  'crs' => $dataDirectory . '\AK_RC1_interp_0p1_to_0p05_trim_east_webtool.txt',
  'cr1' => $dataDirectory . '\AK_RC5_interp_0p1_to_0p05_trim_east_webtool.txt',
  'mapped_ss' => $dataDirectory . '\AK_UHGM1_interp_0p1_to_0p05_trim_east_webtool.txt',
  'mapped_s1' => $dataDirectory . '\AK_UHGM5_interp_0p1_to_0p05_trim_east_webtool.txt'
);
$dostuff = new SetParser($dataset);
$dostuff->process();

// $geomeanSsdParser = new FileParser($dataset['geomean_ssd']);
// $geomeanS1dParser = new FileParser($dataset['geomean_s1d']);
// $crsParser = new FileParser($dataset['crs']);
// $cr1Parser = new FileParser($dataset['cr1']);
// $mappedSsParser = new FileParser($dataset['mapped_ss']);
// $mappedS1Parser = new FileParser($dataset['mapped_s1']);

// $eof = false;
// while(!$eof) {
//   try {
//     $geomeanSsdData = $geomeanSsdParser->nextLine();
//     if ($geomeanSsdData != null) {
//       $geomeanSsdLatitude = $geomeanSsdData['latitude'];
//       $geomeanSsdLongitude = $geomeanSsdData['longitude'];
//       $geomeanSsdValue = $geomeanSsdData['value'];
//       // print "Lat: $latitude, Lon: $longitude, Value: $value\n";
//     } else {
//       $eof = true;
//     }

//     $geomeanS1dData = $geomeanS1dParser->nextLine();
//     if ($geomeanS1dData != null) {
//       $geomeanS1dLatitude = $geomeanS1dData['latitude'];
//       $geomeanS1dLongitude = $geomeanS1dData['longitude'];
//       $geomeanS1dValue = $geomeanS1dData['value'];
//     } else {
//       if ($eof == false) {
//         $file = $dataset['geomean_s1d'];
//         throw new Exception ("Files are not the same length: $file ended early.");
//       }
//     }

//     $crsData = $crsParser->nextLine();
//     if ($crsData != null) {
//       $crsLatitude = $crsData['latitude'];
//       $crsLongitude = $crsData['longitude'];
//       $crsValue = $crsData['value'];
//     } else {
//       if ($eof == false) {
//         $file = $dataset['crs'];
//         throw new Exception ("Files are not the same length: $file ended early.");
//       }
//     }

//     $cr1Data = $cr1Parser->nextLine();
//     if ($cr1Data != null) {
//       $cr1Latitude = $cr1Data['latitude'];
//       $cr1Longitude = $cr1Data['longitude'];
//       $cr1Value = $cr1Data['value'];
//     } else {
//       if ($eof == false) {
//         $file = $dataset['cr1'];
//         throw new Exception ("Files are not the same length: $file ended early.");
//       }
//     }

//     $mappedSsData = $mappedSsParser->nextLine();
//     if ($mappedSsData != null) {
//       $mappedSsLatitude = $mappedSsData['latitude'];
//       $mappedSsLongitude = $mappedSsData['longitude'];
//       $mappedSsValue = $mappedSsData['value'];
//     } else {
//       if ($eof == false) {
//         $file = $dataset['mapped_ss'];
//         throw new Exception ("Files are not the same length: $file ended early.");
//       }
//     }

//     $mappedS1Data = $mappedS1Parser->nextLine();
//     if ($mappedS1Data != null) {
//       $mappedS1Latitude = $mappedS1Data['latitude'];
//       $mappedS1Longitude = $mappedS1Data['longitude'];
//       $mappedS1Value = $mappedS1Data['value'];
//     } else {
//       if ($eof == false) {
//         $file = $dataset['mapped_s1'];
//         throw new Exception ("Files are not the same length: $file ended early.");
//       }
//     }

//     // Sanity checks - Latitudes
//     if (($geomeanSsdLatitude != $geomeanS1dLatitude) or
//         ($geomeanS1dLatitude != $crsLatitude) or
//         ($crsLatitude != $cr1Latitude) or
//         ($cr1Latitude != $mappedSsLatitude) or
//         ($mappedSsLatitude != $mappedS1Latitude)) {
//         throw new Exception ("Latitudes don't match.");
//     }
//     // Sanity checks - Longitudes
//     if (($geomeanSsdLongitude != $geomeanS1dLongitude) or
//         ($geomeanS1dLongitude != $crsLongitude) or
//         ($crsLongitude != $cr1Longitude) or
//         ($cr1Longitude != $mappedSsLongitude) or
//         ($mappedSsLongitude != $mappedS1Longitude)) {
//         throw new Exception ("Longitudes don't match.");
//     }

//     // TODO - Clear to enter values in database.

//   } catch (Exception $e) {
//     $warnings[] = $e->getMessage();
//   }

//   if (count($warnings) !== 0) {
//     $errorCount += 1;
//     print "The following warnings occurred while processing '${file}'\n  ";
//     print implode("\n  ", $warnings) . "\n";
//   }
// }

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
