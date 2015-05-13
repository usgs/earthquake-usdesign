<?php

include_once 'FileFormat.class.php';

class FileParser {

  /**
   * @Constructor
   */
  public function __construct () {
    print "Remove - Constructor\n";
  }


  // ------------------------------------------------------------
  // Public methods
  // ------------------------------------------------------------

  /**
   * @APIMethod
   *
   * @param $file {String}
   *        The name of the file to parse.
   * @param $warnings {Array} Optional
   *        If specified, parse warnings will be pushed onto this array.
   *
   * @return {Data}
   *         The parsed data suitable for adding to the database using
   *         a factory.
   */
  public function parse ($file, &$warnings = null) {
    print "Remove - parse method\n";
    if (!file_exists($file)) {
      throw new Exception ("No such file: '$file'.");
    }
    print("Remove - File exists: $file\n");

    // $dataFile = new FileFormat($this);
    $lines = file($file);
    $i = 0; $numLines = count($lines);
    $line = null;

    for (; $i < $numLines; $i++) {
      $line = $lines[$i];
      print "Remove - Line: $line\n";

      // Skip blank lines
      if ($line === '') { continue; }

      // $field = explode(',', $line);
      $field = preg_split('/\s+/', $line);

      $latitude = trim($field[0]);
      $longitude = trim($field[1]);
      $value = trim($field[2]);
      print "Remove - Lat: $latitude, Lon: $longitude, Value: $value\n";
      // $dataFile->updateCurrentData($line);
    }

    // return $dataFile->toOutput($warnings);
  }


  // ------------------------------------------------------------
  // Private methods
  // ------------------------------------------------------------

  /**
   * @PrivateMethod
   *
   * Logs the warning either into the given $warnings buffer (presumably for
   * subsequent logging), or directly to STDERR if $warnings is not provided.
   *
   * @param $warning {String}
   *        The warning message to log.
   * @param $warnings {Array} By reference. Optional.
   *        A buffer into which generated warnings will be logged. If not
   *        specified, warnings are logged to STDERR.
   */
  private function __addWarning ($warning, &$warnings = null) {
    if ($warnings !== null && is_array($warnings)) {
      $warnings[] = $warning;
    } else {
      fwrite(STDERR, "${warning}\n");
    }
  }
}
