<?php

class FileParser {


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

    if (!file_exists($file)) {
      throw new Exception ("No such file: '$file'.");
    }
    // print("Remove - File exists: $file\n");

    $lines = file($file);
    $i = 0; $numLines = count($lines);
    $line = null;

    for (; $i < $numLines; $i++) {
      $line = $lines[$i];
      // print "Remove - Entire Line: $line\n";

      // Skip blank lines
      if ($line === '') { continue; }

      $entry = preg_split('/\s+/', $line);

      $latitude = trim($entry[0]);
      $longitude = trim($entry[1]);
      $value = trim($entry[2]);
      // print "Remove - Latitude: $latitude, Lon: $longitude, Value: $value\n";
    }

    return [$latitude, $longitude, $value];
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
