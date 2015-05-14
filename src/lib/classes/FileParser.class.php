<?php

class FileParser {

  /**
   * @Constructor
   *
   * @param $file {String}
   *        Name of file to parse
   */
  public function __construct ($file) {
    if (!file_exists($file)) {
      throw new Exception ("No such file: $file.");
    }
    $this->handle = fopen($file, "r") or die("Couldn't get file handle: $file.");
    $this->lineCount = 0;
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
   * @param $file {String}
   *        The name of the file to parse.
   * @param $warnings {Array} Optional
   *        If specified, parse warnings will be pushed onto this array.
   *
   * @return {Data}
   *         The parsed data suitable for adding to the database using
   *         a factory.
   */
  public function nextLine (&$warnings = null) {

    $line = fgets($this->handle);
    // Skip blank lines
    if ($line === '') {
      // Not sure if we need to check for this
    }

    $entry = preg_split('/\s+/', $line);

    $latitude = trim($entry[0]);
    $longitude = trim($entry[1]);
    $value = trim($entry[2]);

    $this->lineCount += 1;

    return array(
      'latitude' => $latitude,
      'longitude' => $longitude,
      'value' => $value
    );
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
