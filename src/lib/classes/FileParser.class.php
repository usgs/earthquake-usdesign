<?php

include_once 'FileFormat.class.php';

class FileParser {

  /**
   * @Constructor
   */
  public function __construct () {

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
   *         The parsed observation suitable for adding to the database using
   *         a factory.
   */
  public function parse ($file, &$warnings = null) {
    if (!file_exists($file)) {
      throw new Exception ("No such file: '$file'.");
    }

    $dataFile = new FileFormat($this);
    $lines = file($file);
    $i = 0; $numLines = count($lines);
    $line = null;

    for (; $i < $numLines; $i++) {
      $line = $lines[$i];

      // Skip blank lines
      if ($line === '') { continue; }

      $field = explode(',', $line);
      $field = trim($field[0]);

      $dataFile->updateCurrentData($line);
    }

    return $dataFile->toOutput($warnings);
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
