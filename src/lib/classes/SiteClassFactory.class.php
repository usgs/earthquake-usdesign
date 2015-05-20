<?php

include_once dirname(__FILE__) . '/../install-funcs.inc.php';

include_once 'LookupDataFactory.class.php';


/**
 * SiteClassFactory extends LookupDataFactory.  It uses the parents,
 * constructor.
 */
class SiteClassFactory extends LookupDataFactory {

  /**
   * @Constructor
   *
   * Creates a new SiteFactory instance. This class can get site_class data
   * from the database. Results include id, name, display_order and, value.
   *
   * @param db {PDO}
   *      The PDO connection to the database. This object should have its error
   *      mode set to throw exceptions.
   */
  public function __construct ($db) {
    parent::__construct($db, 'site_class');
  }


  // ------------------------------------------------------------
  // Protected Methods
  // ------------------------------------------------------------

  /**
   * Augments basic database information such that the result can be used
   * by the web service for output.
   *
   * @param row {Array}
   *      An associative array of information as fetched from the database.
   *
   * @return {Array}
   *      An associative array of information to be used as a reponse to the
   *      web service request.
   */
  protected function _augmentResult ($row) {
    $returnRow = null;

    if (is_array($row)) {
      $returnRow = parent::_augmentResult($row);
      $returnRow['value'] = $row['value'];
    }

    return $returnRow;
  }

  /**
   * Initializes query statements to be used by this instance's get methods.
   * Each query is initialized with the fetch mode set to PDO::FETCH_ASSOC.
   *
   * @param table {String}
   *      The name of the table from which to fetch data.
   * @see LookupDataFactory#_initStatements
   */
  protected function _initStatements ($table) {
    $this->_queryAll = $this->_db->prepare(sprintf(
      '
        SELECT
          id,
          name,
          display_order,
          value
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
          display_order,
          value
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
  }
}

?>
