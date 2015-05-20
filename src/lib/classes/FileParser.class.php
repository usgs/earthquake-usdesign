<?php

include_once dirname(__FILE__) . '/../install-funcs.inc.php';

class FileParser {

  /**
   * @Constructor
   *
   * @param $file {String}
   *        Name of file to parse.
   */
  public function __construct ($file) {
    if (!file_exists($file)) {
      throw new Exception ("No such file: $file.");
    }

    $this->handle = fopen($file, "r");
    if (!$this->handle) {
      throw new Exception ("File open failed: $file.");
    }
  }

  /**
   * @Destructor
   *
   */
  public function __destruct () {
    fclose($this->handle);
  }


  // ------------------------------------------------------------
  // Public methods
  // ------------------------------------------------------------

  /**
   * @APIMethod
   *
   * @return {Data}
   *         Parsed data from a single line in the given data file.
   */
  public function nextLine () {
    $line = fgets($this->handle);

    if ($line === false) {
      return null;
    }

    // Skip blank lines
    if ($line === '') {
      throw new Exception ("Blank line found.");
    }

    $entry = preg_split('/\s+/', $line);

    $latitude = trim($entry[0]);
    $longitude = trim($entry[1]);
    $value = trim($entry[2]);

    return array(
      'latitude' => safefloatval($latitude),
      'longitude' => safefloatval($longitude),
      'value' => safefloatval($value)
    );
  }

}
