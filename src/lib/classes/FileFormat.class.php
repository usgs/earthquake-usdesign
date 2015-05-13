<?php

class FileFormat {

  // Raw data fields from the data file. Populated during file parsing and
  // converted to objects and corresponding ID values during toOutput method.
  private $dateOffset = 0;

  // List of objects used for lookups
  private $parser = null;

  /**
   * @Constructor
   *
   */
  public function __construct ($parser) {
    $this->parser = $parser;
  }


  // ------------------------------------------------------------
  // Public methods
  // ------------------------------------------------------------

  /**
   * Converts all the information that has been stored to this file object
   * into an data instance.
   *
   * @param $warnings {Array} By reference. Optional.
   *        A buffer into which generated warnings will be logged. If not
   *        specified, warnings are logged to STDERR.
   *
   * @return {data}
   */
  public function toOutput (&$warnings = null) {

    $beginEndStamps = array();

    $data = array(
      'latitude' => ($latitude !== null) ? $latitude->value : null,
      'longitude' => ($longitude !== null) ? $longitude->value : null,
      'value' => ($value !== null) ? $value->value : null
    );

    return $data;
  }

  /**
   * @APIMethod
   *
   * Updates the current reading with information found in the given $line. If
   * this method is called before a reading is started, the information is
   * discarded.
   *
   * @param $line {String}
   *        The line from the data file with information to update the reading.
   */
  public function updateCurrentData ($line) {

    $parts = explode(',', $line);
    $field = trim($parts[0]);

    for ($i = 2; $i < count($parts); $i++) {
      $data = $parts[$i];
      $dataParts = explode(':', $data);
      $time = trim($dataParts[0]);
      $value = trim($dataParts[1]);
    }
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
