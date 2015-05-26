<?php

$CLASSES_DIR = dirname(__FILE__);
include_once $CLASSES_DIR . '/FileParser.class.php';
include_once $CLASSES_DIR . '/../install-funcs.inc.php';

class SetParser {

  private $_parsers;
  private $_region;
  private $_dataFactory;

  /**
   * @Constructor
   *
   * @param $dataset {Array}
   *        Associative array with variable types keyed to appropriate file.
   * @param $region {Array}
   *        Region for this dataset, as returned by RegionFactory#get.
   * @param $dataFactory {DataFactory}
   *        data factory for storing parsed data.
   */
  public function __construct ($dataset, $region, $dataFactory) {
    $this->_parsers = array();
    foreach ($dataset as $key => $file) {
      $this->_parsers[$key] = new FileParser($file);
    }
    $this->_region = $region;
    $this->_dataFactory = $dataFactory;
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
      $first = true;
      $latitude = null;
      $longitude = null;
      $values = array();

      foreach ($this->_parsers as $key => $parser) {
        $data = $parser->nextLine();

        // check for end of file
        if ($data === null) {
          if (!$first) {
            if ($eof === false) {
              throw new Exception('Files not the same length: ' .
                  $parser->file . ' ended early');
            }
          }
          $eof = true;
          continue;
        }

        // make sure latitude/longitude from this file matches any previous
        if ($latitude === null || $longitude === null) {
          $latitude = $data['latitude'];
          $longitude = $data['longitude'];
        } else if ($latitude !== $data['latitude']) {
          throw new Exception('Latitudes don\'t match:' .
              ' expected ' . $latitude . ', found ' . $data['latitude'] .
              ' in file ' . $parser->file);
        } else if ($longitude !== $data['longitude']) {
          throw new Exception('Longitudes don\'t match:' .
              ' expected ' .$longitude . ', found ' . $data['longitude'] .
              ' in file ' . $parser->file);
        }

        // save value
        $values[$key] = $data['value'];
      }

      if (!$eof) {
        // enter values in database.
        $this->_dataFactory->insert($latitude, $longitude, $this->_region,
            $values);
      }
    }
  }
}
