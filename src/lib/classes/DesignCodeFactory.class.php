<?php

include_once dirname(__FILE__) . '/../install-funcs.inc.php';

include_once 'LookupDataFactory.class.php';

class DesignCodeFactory extends LookupDataFactory {

  private $_querySupportedRegions = null;
  private $_querySupportedRiskCategories = null;
  private $_querySupportedSiteClasses = null;

  /**
   * @Constructor
   *
   * Creates a new DesignCodeFactory instance. This class can get design code
   * data from the database. Results include id, name, hazard basis,
   * site classes, risk categories and regions.
   *
   * @param db {PDO}
   *      The PDO connection to the database. This object should have its error
   *      mode set to throw exceptions.
   */
  public function __construct ($db) {
    parent::__construct($db, 'design_code');
  }

  // ------------------------------------------------------------
  // Protected Methods
  // ------------------------------------------------------------

  /**
   * Augments basic datase information such that the result can be used
   * by the web service for output.
   *
   * @param row {Array}
   *      An associative array of information as fetched from the database.
   *
   * @return {Array}
   *      An associative array of information to be used as a reponse to the
   *      web service request.
   *
   * @see LookupDataFactory#_augmentResult
   */
  protected function _augmentResult ($row) {
    if (is_array($row)) {
      $row = parent::_augmentResult($row);

      $row['site_classes'] = $this->_fetchSupportedSiteClasses($row['id']);
      $row['risk_categories'] = $this->_fetchSupportedRiskCategories($row['id']);
      $row['regions'] = $this->_fetchSupportedRegions($row['id']);

      return $row;
    } else {
      return null;
    }
  }

  /**
   * Initializes query statements to be used by this instance's get methods.
   * Each query is initialized with the fetch mode set to PDO::FETCH_ASSOC.
   *
   * @param table {String}
   *      The name of the table from which to fetch data.
   *
   * @see LookupDataFactory#_initStatements
   */
  protected function _initStatements ($table) {
    $this->_queryAll = $this->_db->prepare(sprintf(
      '
        SELECT
          id,
          name,
          hazard_basis_id,
          display_order
        FROM
          %s
        ORDER BY
          display_order ASC
      ',
      $table
    ));
    $this->_queryAll->setFetchMode(PDO::FETCH_ASSOC);

    $this->_queryById = $this->_db->prepare(sprintf(
      '
        SELECT
          id,
          name,
          hazard_basis_id,
          display_order
        FROM
          %s
        WHERE
          id = :id
        ORDER BY
          display_order ASC
      ',
      $table
    ));
    $this->_queryById->setFetchMode(PDO::FETCH_ASSOC);

    $this->_querySupportedRegions = $this->_db->prepare('
      SELECT
        id
      FROM
        region
      WHERE
        design_code_id = :design_code_id
      ORDER BY
        id ASC
    ');
    $this->_querySupportedRegions->setFetchMode(PDO::FETCH_ASSOC);

    $this->_querySupportedRiskCategories = $this->_db->prepare('
      SELECT
        id
      FROM
        risk_category
      WHERE
        id IN (
          SELECT
            risk_category_id
          FROM
            design_code_risk_category
          WHERE
            design_code_id = :design_code_id
        )
      ORDER BY
        display_order ASC
    ');
    $this->_querySupportedRiskCategories->setFetchMode(PDO::FETCH_ASSOC);

    $this->_querySupportedSiteClasses = $this->_db->prepare('
      SELECT
        id
      FROM
        site_class
      WHERE
        id IN (
          SELECT
            site_class_id
          FROM
            design_code_site_class
          WHERE
            design_code_id = :design_code_id
        )
      ORDER BY
        display_order ASC
    ');
    $this->_querySupportedSiteClasses->setFetchMode(PDO::FETCH_ASSOC);
  }

  // ------------------------------------------------------------
  // Private Methods
  // ------------------------------------------------------------

  /**
   * @PrivateMethod
   *
   * @param id {Integer}
   *      The design code id for which to fetch information.
   *
   * @return {Array}
   *      An ordered array containing ids of regions supported by the input
   *      design code id.
   */

  private function _fetchSupportedRegions ($id) {
    $results = array();

    try {
      $this->_querySupportedRegions->bindValue(':design_code_id',
          safeintval($id), PDO::PARAM_INT);

      $this->_querySupportedRegions->execute();
      while (($result = $this->_querySupportedRegions->fetch())) {

        $results[] = safeintval($result['id']);
      }
    } finally {
      $this->_querySupportedRegions->closeCursor();
    }

    return $results;
  }

  /**
   * @PrivateMethod
   *
   * @param id {Integer}
   *      The design code id for which to fetch information.
   *
   * @return {Array}
   *      An ordered array containing ids of risk categories supported by the
   *      input design code id.
   */
  private function _fetchSupportedRiskCategories ($id) {
    $results = array();

    try {
      $this->_querySupportedRiskCategories->bindValue(':design_code_id',
          safeintval($id), PDO::PARAM_INT);

      $this->_querySupportedRiskCategories->execute();
      while ($result = $this->_querySupportedRiskCategories->fetch()) {
        $results[] = safeintval($result['id']);
      }
    } finally {
      $this->_querySupportedRiskCategories->closeCursor();
    }

    return $results;
  }

  /**
   * @PrivateMethod
   *
   * @param id {Integer}
   *      The design code id for which to fetch information.
   *
   * @return {Array}
   *      An ordered array containing ids of site classes supported by the input
   *      design code id.
   */
  private function _fetchSupportedSiteClasses ($id) {
    $results = array();

    try {
      $this->_querySupportedSiteClasses->bindValue(':design_code_id',
          safeintval($id), PDO::PARAM_INT);

      $this->_querySupportedSiteClasses->execute();
      while ($result = $this->_querySupportedSiteClasses->fetch()) {
        $results[] = safeintval($result['id']);
      }
    } finally {
      $this->_querySupportedSiteClasses->closeCursor();
    }

    return $results;
  }
}
