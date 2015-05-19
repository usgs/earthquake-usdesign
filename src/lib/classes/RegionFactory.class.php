<?php

  include_once '../install-funcs.inc.php';

  class RegionFactory extends LookupDataFactory {

    private $_query = null;
    private $_queryAll = null;
    private $_queryById = null;

    /**
     * @Constructor
     *
     * Create a new RegionFactory instance.
     *
     * @param db {PDO}
     *      The connection to the database to be used for fetching data.
     */
    public function __construct ($db) {
      $this->_db = $db;
      $this->_initStatements();
    }


    /**
     * @APIMethod
     *
     * Fetch the region data for the given latitude/longitude point and
     * design_code_id.
     *
     * @param latitude {Double}
     *      Decimal degrees latitude for point of interest.
     * @param longitude {Double}
     *      Decimal degrees longitude for point of interest.
     * @param design_code_id {Integer}
     *      Id for the design code
     *
     * @return {Array}
     *      Associative array with region information for the region matching
     *      the latitude/longitude point and the design_code_id
     */
    public function get ($latitude, $longitude, $design_code_id) {
      $results = array();

      $latitude = safefloatval($latitude);
      $longitude = safefloatval($longitude);

      if ($latitude === null) {
        throw new Exception('Latitude may not be null.');
      }

      if ($longitude === null) {
        throw new Exception('Longitude may not be null.');
      }

      try {
        $this->_query->bindParam(':longitude', $longitude);
        $this->_query->bindParam(':latitude', $latitude);
        $this->_query->bindParam(':design_code_id', $design_code_id);

        $this->_query->execute();

        $results = $this->_augmentResult($this->_query->fetch());
      } finally {
        $this->_query->closeCursor();
      }

      return $results;
    }


    /**
     * Alters the raw result such that data are of the proper type.
     *
     * @param row {Array}
     *      An associative array containing raw data from the database.
     *
     * @return {Array}
     *      An associative array containing appropriately augmented data.
     */
    protected function _augmentResult ($row) {
      if (is_array($row)) {
        return array(
          'id' => safeintval($row['id']),
          'name' => $row['name'],
          'min_latitude' => safefloatval($row['min_latitude']),
          'max_latitude' => safefloatval($row['max_latitude']),
          'min_longitude' => safefloatval($row['min_longitude']),
          'max_longitude' => safefloatval($row['max_longitude']),
          'grid_spacing' => safefloatval($row['grid_spacing'])
        );
      } else {
        return null;
      }
    }


    /**
     * @PrivateMethod
     *
     * Initializes database statements used by the class.
     */
    protected function _initStatements () {
      $this->_queryAll = $this->_db->prepare(
        '
          SELECT
            r.id,
            r.design_code_id,
            r.metadata_id,
            r.name,
            r.min_latitude,
            r.max_latitude,
            r.min_longitude,
            r.max_longitude,
            r.grid_spacing,
            m.max_direction_ss,
            m.max_direction_s1,
            m.percentile_ss,
            m.percentile_s1,
            m.percentile_pga,
            m.deterministic_floor_ss,
            m.deterministic_floor_s1,
            m.deterministic_floor_pga
          FROM
            region r JOIN metadata m ON (r.metatdata_id = m.id)
          ORDER BY
            r.id ASC
        '
      );
      $this->_queryAll->setFetchMode(PDO::FETCH_ASSOC);

      $this->_queryById = $this->_db->prepare(
        '
          SELECT
            r.id,
            r.design_code_id,
            r.metadata_id,
            r.name,
            r.min_latitude,
            r.max_latitude,
            r.min_longitude,
            r.max_longitude,
            r.grid_spacing,
            m.max_direction_ss,
            m.max_direction_s1,
            m.percentile_ss,
            m.percentile_s1,
            m.percentile_pga,
            m.deterministic_floor_ss,
            m.deterministic_floor_s1,
            m.deterministic_floor_pga
          FROM
            region r JOIN metadata m ON (r.metatdata_id = m.id)
          WHERE r.id = :id
          ORDER BY
            r.id ASC
        '
      );
      $this->_queryById->setFetchMode(PDO::FETCH_ASSOC);

      $this->_query = $this->_db->prepare(
        '
          SELECT
            r.id,
            r.design_code_id,
            r.metadata_id,
            r.name,
            r.min_latitude,
            r.max_latitude,
            r.min_longitude,
            r.max_longitude,
            r.grid_spacing,
            m.max_direction_ss,
            m.max_direction_s1,
            m.percentile_ss,
            m.percentile_s1,
            m.percentile_pga,
            m.deterministic_floor_ss,
            m.deterministic_floor_s1,
            m.deterministic_floor_pga
          FROM
            region r JOIN metadata m ON (r.metatdata_id = m.id)
          WHERE r.design_code_id = :design_code_id
          AND r.min_latitude < :latitude
          AND r.max_latitude > :latitude
          AND r.min_longitude < :longitude
          AND r.max_longitude > :longitude
          ORDER BY
            r.id ASC
        '
      );
      $this->_query->setFetchMode(PDO::FETCH_ASSOC);
    }
  }
