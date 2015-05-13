<?php

include_once 'ObservationFile.class.php';

class ObservationFileParser {

  // Loaded with ObservatoryDetail objects during instantiation
  protected $observatories = array();
  protected $factory = null;
  protected $userFactory = null;

  /**
   * @Constructor
   *
   * @param $observatoryFactory {ObservatoryFactory}
   *        A factory object capable of fetching Observatory and
   *        ObservatoryDetail objects from a data source.
   * @param $userFactory {UserFactory}
   *        A factory object capable of fetching User objects.
   */
  public function __construct ($observatoryFactory, $userFactory) {
    $this->factory = $observatoryFactory;
    $this->userFactory = $userFactory;
    $this->__loadObservatories();
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
   * @return {Observation}
   *         The parsed observation suitable for adding to the database using
   *         a factory.
   */
  public function parse ($file, &$warnings = null) {
    if (!file_exists($file)) {
      throw new Exception ("No such file: '$file'.");
    }

    $observationFile = new ObservationFile($this);
    $lines = file($file);
    $i = 0; $numLines = count($lines);
    $line = null;

    for (; $i < $numLines; $i++) {
      $line = $lines[$i];

      // Skip blank lines
      if ($line === '') { continue; }

      $field = explode(',', $line);
      $field = trim($field[0]);

      if ($this->_isNewReading($field)) {
        $observationFile->startReading($line);
      } else if ($this->_isReadingField($field)) {
        $observationFile->updateCurrentReading($line);
      } else if ($this->_isIncludeInfo($field)) {
        $observationFile->updateIncludeInfo($line);
      } else {
        $observationFile->updateMetaInfo($line);
      }
    }

    return $observationFile->toObservation($warnings);
  }

  /**
   * Looks through $this->observatories for the observatory with a given $code.
   *
   * @param $code {String}
   *        The code for the observatory to get.
   * @param $warnings {Array} By reference. Optional.
   *        A buffer into which generated warnings will be logged. If not
   *        specified, warnings are logged to STDERR.
   *
   * @return {Observatory}
   *         The observatory for the given $code, or NULL if no such observatory
   *         is found.
   */
  public function _getObservatory ($code, &$warnings = null) {
    foreach ($this->observatories as $observatory) {
      if ($observatory->code === $code) {
        return $observatory;
      }
    }

    $this->__addWarning("No observatory found for code: '${code}'.",
        $warnings);

    return null;
  }

  /**
   * Looks through the piers on the given $observatory for a pier with the given
   * $name that began prior to the given $begin and ended after the given $end
   * (or has not yet ended). Creates the pier if it doesn't exist.
   *
   * @param $observatory_code {ObservatoryDetail}
   *        The observatory to search.
   * @param $pier_name {String}
   *        The name of the pier to find.
   * @param $pier_correction {Number}
   *        Correction value for the pier.
   * @param $warnings {Array} By reference. Optional.
   *        A buffer into which generated warnings will be logged. If not
   *        specified, warnings are logged to STDERR.
   *
   * @return {Pier}
   *         The pier with the given name and correction
   *         or NULL if no such pier is found.
   */
  public function _getPier ($observatory_code, $pier_name, $pier_correction,
        &$warnings = null) {

    $observatory = $this->_getObservatory($observatory_code, $warnings);
    if ($observatory === null) {
      return null;
    }

    // If the pier exists, return it
    foreach ($observatory->piers as $pier) {
      if ($pier->name === $pier_name &&
          $pier->correction == $pier_correction) {
        return $pier;
      }
    }

    // If the pier doesn't exist, create it then find it and return it.
    $this->factory->createPier($observatory->id, $pier_name, $pier_correction);
    $observatory->piers = $this->factory->getPiers($observatory->id);
    foreach ($observatory->piers as $pier) {
      if ($pier->name === $pier_name &&
          $pier->correction == $pier_correction) {
        return $pier;
      }
    }

    // This should never happen
    $this->__addWarning("Failed to create '${pier}' pier for '${observatory}'.",
        $warnings);
    return null;
  }

  /**
   * Looks through the marks on the given $pier for a mark with the given
   * $name that began prior to the given $begin and ended after the given $end
   * (or has not yet ended). Creates the mark if it doesn't exist.
   *
   * @param $observatory_code {ObservatoryDetail}
   *        The observatory to search.
   * @param $pier_name {String}
   *        The name of the pier to find.
   * @param $pier_correction {Number}
   *        Correction value for the pier.
   * @param $make_name {String}
   *        The name of the mark to find.
   * @param $mark_azimuth {Number}
   *        Azimuth value for the mark.
   * @param $warnings {Array} By reference. Optional.
   *        A buffer into which generated warnings will be logged. If not
   *        specified, warnings are logged to STDERR.
   *
   * @return {Mark}
   *         The mark with the given name or NULL if no such mark is found.
   */
  public function _getMark ($observatory_code, $pier_name, $pier_correction,
      $mark_name, $mark_azimuth, &$warnings = null) {

    $pier = $this->_getPier($observatory_code, $pier_name,
        $pier_correction, $warnings);
    if ($pier === null) {
      return null;
    }

    // If the mark exists, return it.
    foreach ($pier->marks as $mark) {
      if ($mark->name === $mark_name &&
          $mark->azimuth == $mark_azimuth) {
        return $mark;
      }
    }

    // If the mark doesn't exist, create it then find it and return it.
    $this->factory->createMark($pier->id, $mark_name, $mark_azimuth);
    $pier->marks = $this->factory->getMarks($pier->id);
    foreach ($pier->marks as $mark) {
      if ($mark->name === $mark_name &&
          $mark->azimuth == $mark_azimuth) {
        return $mark;
      }
    }

    // This should never happen
    $warning = "Failed to create '${mark}' mark for '${pier}' " .
        " at '${observatory}'.";
    $this->__addWarning($warning, $warnings);
    return null;
  }

  /**
   * Looks through the instruments on the given $observatory for an instrument
   * with the given $serial number that began prior to the given $begin and
   * ended after the given $end (or has not yet ended). Creates the mark if it
   * doesn't exist.
   *
   * @param $observatory_code {ObservatoryDetail}
   *        The observatory to search.
   * @param $serial {String}
   *        The serial number of the instrument to find.
   * @param $type {String}
   *        (theodolite | electronics)
   * @param $warnings {Array} By reference. Optional.
   *        A buffer into which generated warnings will be logged. If not
   *        specified, warnings are logged to STDERR.
   *
   * @return {Instrument}
   *         The instrument with the given name or NULL if no such instrument
   *         is found.
   */
  public function _getInstrument ($observatory_code, $serial, $type,
        &$warnings = null) {

    if ($serial === null) {
      if ($type !== 'electronics') {
        $this->__addWarning("No serial number found for '${type}' instrument",
            $warnings);
      }
      return null;
    }
    $observatory = $this->_getObservatory($observatory_code, $warnings);
    if ($observatory === null) {
      return null;
    }

    // If the instrument exists, return it.
    foreach ($observatory->instruments as $inst) {
      if ($inst->serial_number === $serial && $inst->type === $type) {
        return $inst;
      }
    }

    // If the instrument doesn't exist, create it then find it and return it.
    $this->factory->createInstrument($observatory->id, $serial, $type);
    $observatory->instruments = $this->factory->getInstruments($observatory->id);
    foreach ($observatory->instruments as $inst) {
      if ($inst->serial_number === $serial && $inst->type === $type) {
        return $inst;
      }
    }

    // This should never happen
    $warning = "Failed to create '${instrument}' '${type}' instrument" .
        " at '${observatory}'.";
    $this->__addWarning($warning, $warnings);
    return null;
  }

  /**
   * Looks for user, creates a user if it doesn't exist.
   *
   * @param $username {String}
   * @param $observatory_code {ObservatoryDetail}
   *        Default observatory if user is created.
   *
   * @return {User}
   */
  public function _getUser ($username, $observatory_code) {

    $username = strtolower($username);
    $user = $this->userFactory->getUserFromUsername($username);
    if ($user === null) {
      $observatory = $this->_getObservatory($observatory_code);
      $user = $this->userFactory->createUserSkeleton($username, $username,
          $observatory->id);
    }
    return $user;
  }

  /**
   * @param $field {String}
   *        The field label from the observation file.
   *
   * @return {Boolean}
   *         True if this field indicates the start of a new reading. False
   *         otherwise.
   */
  protected function _isNewReading ($field) {
    return ($field === 'Set');
  }

  /**
   * @param $field {String}
   *        The field label from the observation file.
   *
   * @return {Boolean}
   *         True if this field contains reading attribute data. False
   *         otherwise.
   */
  protected function _isReadingField ($field) {
    return array_key_exists($field, ObservationFile::$READING_FIELDS);
  }

  /**
   * @param $field {String}
   *        The field label from the observation file.
   *
   * @return {Boolean}
   *         True if this field contains include flag data. False otherwise.
   */
  protected function _isIncludeInfo ($field) {
    // Actual field name includes set number. Since set number is variable,
    // must trim that off for comparison.
    $fieldParts = explode(' ', $field);
    array_pop($fieldParts);
    $subField = implode(' ', $fieldParts);

    return array_key_exists($subField, ObservationFile::$INCLUDE_FIELDS);
  }


  // ------------------------------------------------------------
  // Private methods
  // ------------------------------------------------------------

  /**
   * Loads $this->observatories with ObservatoryDetail instances representing
   * all the observatories available from the instance factory.
   *
   */
  private function __loadObservatories () {
    $summaries = $this->factory->getObservatories();

    foreach ($summaries as $summary) {
      $this->observatories[] = $this->factory->getObservatory($summary->id);
    }
  }

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
