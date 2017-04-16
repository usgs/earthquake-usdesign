<?php

include_once dirname(__FILE__) . '/../install-funcs.inc.php';
include_once 'LookupDataFactory.php';


/**
 * SiteClassFactory extends LookupDataFactory.  It uses the parents,
 * constructor.
 */
class SiteFactory extends LookupDataFactory {


  // ------------------------------------------------------------
  // Protected Methods
  // ------------------------------------------------------------

  /**
   * @ExtensionPoint
   *
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
    if (is_array($row)) {
      return array(
        'id' => safeintval($row['id']),
        'name' => $row['name'],
        'display_order' => safeintval($row['display_order']),
        'value' => safeintval($row(['value']))
      );
    } else {
      return null;
    }
  }

  /**
   * @ExtensionPoint
   *
   * Initializes query statements to be used by this instance's get methods.
   * Each query is initialized with the fetch mode set to PDO::FETCH_ASSOC.
   *
   * @param table {String}
   *      The name of the table from which to fetch data.
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
