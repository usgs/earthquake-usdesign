<?php

  include_once dirname(__FILE__) . '/../install-funcs.inc.php';

  include_once 'LookupDataFactory.class.php';

  class RegionFactory extends LookupDataFactory {

    protected $_query = null;
    protected $_queryAll = null;
    protected $_queryById = null;

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
      $this->_initStatements('region');
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
      $results = null;

      $latitude = safefloatval($latitude);
      $longitude = safefloatval($longitude);
      $design_code_Id = safeintval($design_code_id);

      if ($latitude === null) {
        throw new Exception('Latitude may not be null.');
      }

      if ($longitude === null) {
        throw new Exception('Longitude may not be null.');
      }

      if ($design_code_id === null) {
        throw new Exception('Design code may not be null.');
      }

      try {
        $this->_query->bindParam(':longitude', $longitude, PDO::PARAM_STR);
        $this->_query->bindParam(':latitude', $latitude, PDO::PARAM_STR);
        $this->_query->bindParam(':design_code_id', $design_code_id,
            PDO::PARAM_INT);

        $this->_query->execute();

        $result = $this->_augmentResult($this->_query->fetch());
      } finally {
        $this->_query->closeCursor();
      }

      return $result;
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
          'grid_spacing' => safefloatval($row['grid_spacing']),

          'max_direction_ss' => safefloatval($row['max_direction_ss']),
          'max_direction_s1' => safefloatval($row['max_direction_s1']),

          'percentile_ss' => safefloatval($row['percentile_ss']),
          'percentile_s1' => safefloatval($row['percentile_s1']),
          'percentile_pga' => safefloatval($row['percentile_pga']),

          'deterministic_floor_ss' =>
              safefloatval($row['deterministic_floor_ss']),
          'deterministic_floor_s1' =>
              safefloatval($row['deterministic_floor_s1']),
          'deterministic_floor_pga' =>
              safefloatval($row['deterministic_floor_pga'])
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
    protected function _initStatements ($table) {
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
            region r JOIN metadata m ON (r.metadata_id = m.id)
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
            region r JOIN metadata m ON (r.metadata_id = m.id)
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
            region r JOIN metadata m ON (r.metadata_id = m.id)
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
