<?php

include_once '../install-funcs.inc.php';

class LookupDataFactory {

  private $_db = null;
  private $_queryAll = null;
  private $_queryById = null;

  /**
   * @Constructor
   *
   * Creates a new LookupDataFactory instance. This class can get lookup data
   * from any table with "id", "name", and "value" columns. Sub-classes may
   * customize the results with additional data by overriding the augmentResult
   * method.
   *
   * @param db {PDO}
   *      The PDO connection to the database. This object should have its error
   *      mode set to throw exceptions.
   * @param table {String}
   *      The name of the table from which to fetch data.
   */
  public function __construct ($db, $table) {
    $this->_db = $db;
    $this->_initStatements($table);
  }

  // ------------------------------------------------------------
  // Public Methods
  // ------------------------------------------------------------

  /**
   * @APIMethod
   *
   * Gets all the data from the reference table. Ordered by display_order.
   *
   * @return {Array}
   *      An array containing associative arrays of data contained in the
   *      reference table.
   */
  public function getAll () {
    $results = array();

    try {
      $this->_queryAll->execute();

      while ($row = $this->_queryAll->fetch()) {
        $results[] = $this->_augmentResult($row);
      }
    } finally {
      $this->_queryAll->closeCursor();
    }

    return $results;
  }

  /**
   * @APIMethod
   *
   * Gets a single row of data from the reference table.
   *
   * @param id {Integer}
   *      The id of the row to get from the table.
   *
   * @return {Array}
   *      An associative array containing
   */
  public function getById ($id) {
    $result = null;

    try {
      $this->_queryById->bindParam(':id', safeintval($id), PDO::PARAM_INT);

      $result = $this->_augmentResult($this->_queryById->fetch());
    } finally {
      $this->_queryById->closeCursor();
    }

    return $result;
  }

  // ------------------------------------------------------------
  // Protected Methods
  // ------------------------------------------------------------

  /**
   * @ExtensionPoint
   *
   * Augments basic datase information such that the result can be used
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
    return array(
      'id' => safeintval($row['id']),
      'name' => $row['name'],
      'display_order' => safeintval($row['display_order'])
    );
  }

  // ------------------------------------------------------------
  // Private Methods
  // ------------------------------------------------------------

  /**
   * @PrivateMethod
   *
   * Initializes query statements to be used by this instances get methods.
   * Each query is initialized with the fetch mode set to PDO::FETCH_ASSOC.
   *
   * @param table {String}
   *      The name of the table from which to fetch data.
   */
  private function _initStatements ($table) {
    $this->_queryAll = $this->_db->prepare(sprintf(
      '
        SELECT
          id,
          name,
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
  }
}
