<?php

include_once 'classes/FileParser.class.php';

class SetParser {

  /**
   * @Constructor
   *
   * @param $dataset {Array}
   *        Associative array with variable types keyed to appropriate file.
   */
  public function __construct ($dataset) {
    $this->geomeanSsdParser = new FileParser($dataset['geomean_ssd']);
    $this->geomeanS1dParser = new FileParser($dataset['geomean_s1d']);
    $this->crsParser = new FileParser($dataset['crs']);
    $this->cr1Parser = new FileParser($dataset['cr1']);
    $this->mappedSsParser = new FileParser($dataset['mapped_ss']);
    $this->mappedS1Parser = new FileParser($dataset['mapped_s1']);
  }


  // ------------------------------------------------------------
  // Public methods
  // ------------------------------------------------------------

  /**
   * @APIMethod
   *
   */
  public function process () {
    $eof = false;
    while(!$eof) {
      try {
        $geomeanSsdData = $this->geomeanSsdParser->nextLine();
        if ($geomeanSsdData != null) {
          $geomeanSsdLatitude = $geomeanSsdData['latitude'];
          $geomeanSsdLongitude = $geomeanSsdData['longitude'];
          $geomeanSsdValue = $geomeanSsdData['value'];
        } else {
          $eof = true;
        }

        $geomeanS1dData = $this->geomeanS1dParser->nextLine();
        if ($geomeanS1dData != null) {
          $geomeanS1dLatitude = $geomeanS1dData['latitude'];
          $geomeanS1dLongitude = $geomeanS1dData['longitude'];
          $geomeanS1dValue = $geomeanS1dData['value'];
        } else {
          if ($eof == false) {
            $file = $dataset['geomean_s1d'];
            throw new Exception ("Files are not the same length: $file ended early.");
          }
        }

        $crsData = $this->crsParser->nextLine();
        if ($crsData != null) {
          $crsLatitude = $crsData['latitude'];
          $crsLongitude = $crsData['longitude'];
          $crsValue = $crsData['value'];
        } else {
          if ($eof == false) {
            $file = $dataset['crs'];
            throw new Exception ("Files are not the same length: $file ended early.");
          }
        }

        $cr1Data = $this->cr1Parser->nextLine();
        if ($cr1Data != null) {
          $cr1Latitude = $cr1Data['latitude'];
          $cr1Longitude = $cr1Data['longitude'];
          $cr1Value = $cr1Data['value'];
        } else {
          if ($eof == false) {
            $file = $dataset['cr1'];
            throw new Exception ("Files are not the same length: $file ended early.");
          }
        }

        $mappedSsData = $this->mappedSsParser->nextLine();
        if ($mappedSsData != null) {
          $mappedSsLatitude = $mappedSsData['latitude'];
          $mappedSsLongitude = $mappedSsData['longitude'];
          $mappedSsValue = $mappedSsData['value'];
        } else {
          if ($eof == false) {
            $file = $dataset['mapped_ss'];
            throw new Exception ("Files are not the same length: $file ended early.");
          }
        }

        $mappedS1Data = $this->mappedS1Parser->nextLine();
        if ($mappedS1Data != null) {
          $mappedS1Latitude = $mappedS1Data['latitude'];
          $mappedS1Longitude = $mappedS1Data['longitude'];
          $mappedS1Value = $mappedS1Data['value'];
        } else {
          if ($eof == false) {
            $file = $dataset['mapped_s1'];
            throw new Exception ("Files are not the same length: $file ended early.");
          }
        }

        // Sanity checks - Latitudes
        if (($geomeanSsdLatitude != $geomeanS1dLatitude) or
            ($geomeanS1dLatitude != $crsLatitude) or
            ($crsLatitude != $cr1Latitude) or
            ($cr1Latitude != $mappedSsLatitude) or
            ($mappedSsLatitude != $mappedS1Latitude)) {
            throw new Exception ("Latitudes don't match.");
        }
        // Sanity checks - Longitudes
        if (($geomeanSsdLongitude != $geomeanS1dLongitude) or
            ($geomeanS1dLongitude != $crsLongitude) or
            ($crsLongitude != $cr1Longitude) or
            ($cr1Longitude != $mappedSsLongitude) or
            ($mappedSsLongitude != $mappedS1Longitude)) {
            throw new Exception ("Longitudes don't match.");
        }

      // TODO - Clear to enter values in database.

      } catch (Exception $e) {
        $warnings[] = $e->getMessage();
      }

      if (count($warnings) !== 0) {
        $errorCount += 1;
        print "The following warnings occurred while processing '${file}'\n  ";
        print implode("\n  ", $warnings) . "\n";
      }
    }
    return $errorCount;
  }
}
