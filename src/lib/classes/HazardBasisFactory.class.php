<?php

include_once dirname(__FILE__) . '/../install-funcs.inc.php';

include_once 'LookupDataFactory.class.php';

class HazardBasisFactory extends LookupDataFactory {

  private $_querySupportedDesignCode = null;

  /**
   * @Constructor
   *
   * Create a new HazardBasisFactory instance that extend the Lookup Data
   * Factory.
   */
  public function __construct ($db) {
    parent:: __construct($db, 'hazard_basis');
  }

  //----------------------------------------------------------------------------
  // Protected Methods
  //----------------------------------------------------------------------------

  /**
   * Augments basic database information such that result can be used
   * by the web service for output.
   *
   * @param row {Array}
   *    An associative array of information as fetched from the database.
   *
   * @return {Array}
   *    An Associative array of information to be used as a response to the web
   *    service request.
   *
   * @see LookupDataFactory#_augmentResult
   */
  protected function _augmentResult ($row) {
    $returnRow = null;

    if (is_array($row)) {
      $returnRow = parent::_augmentResult($row);

      $returnRow['design_code'] = $this->_fetchSupportedDesignCodes($row['id']);
    }

    return $returnRow;
  }

  /**
   * Initializes query statements to be used by this instanc's get methods.
   * Each query is initialized with the fetch mode set to PDO::FETCH_ASSOC.
   *
   * @param table {String}
   *       The name of the table from which to fetch data.
   *
   * @see LookupDataFactory
   */
  protected function _initStatements ($table) {
    parent::_initStatements($table);

    $this->_querySupportedDesignCode = $this->_db->prepare(
      '
        SELECT
          id
        FROM
          design_code
        WHERE
          hazard_basis_id = :hazard_basis_id
        ORDER BY
          display_order ASC
      '
    );
    $this->_querySupportedDesignCode->setFetchMode(PDO::FETCH_ASSOC);
  }

  //----------------------------------------------------------------------------
  //Private Methods
  //----------------------------------------------------------------------------

  /**
   * @PrivateMethod
   *
   * @param id {Integer}
   *        The Design code id for which to fetch information.
   *
   * @return {Array}
   *       An ordered array contaioning ids of design codes supported by the
   *       input hazard basis id.
   */
  private function _fetchSupportedDesignCodes ($id) {
    $results = array();

    try {
      $this->_querySupportedDesignCode->bindValue(':hazard_basis_id',
          safeintval($id), PDO::PARAM_INT);

      $this->_querySupportedDesignCode->execute();
      while ($result = $this->_querySupportedDesignCode->fetch()) {
        $results[] = safeintval($result['id']);
      }
    } finally {
      $this->_querySupportedDesignCode->closeCursor();
    }

    return $results;
  }
}
?>
