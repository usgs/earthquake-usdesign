<?php

include_once dirname(__FILE__) . '/../install-funcs.inc.php';

class DataFactory {

  private $_db = null;
  private $_query = null;
  private $_insert = null;
  private $_delete = null;
  private $_tlQuery = null;


  /**
   * @Constructor
   *
   * Create a new DataFactory instance.
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
   * Fetch the requisite grid point data for the given
   * latitude/longitude/region.
   *
   * @param latitude {Double}
   *      Decimal degrees latitude for point of interest.
   * @param longitude {Double}
   *      Decimal degrees longitude for point of interest.
   * @param region {Array}
   *      Associative array containing at least "id" and "grid_spacing" keys.
   *
   * @return {Array}
   *      Ordered array containing grid point results for location of interest.
   *      Each grid point result contains a latitude and longitude key as
   *      well as keys for each mapped value. The order of these results are
   *      [TL, TR, BL, BR], or [T, B], or [L, R], or [P] depending on if
   *      the requested location was inside a grid, on a grid edge, or on a grid
   *      vertex.
   */
  public function get ($latitude, $longitude, $region) {
    $results = array();

    $gridSpacing = safefloatval($region['grid_spacing']);
    $regionId = $region['id'];

    $latitude = safefloatval($latitude);
    $longitude = safefloatval($longitude);

    if ($latitude === null) {
      throw new Exception('Latitude may not be null.');
    }

    if ($longitude === null) {
      throw new Exception('Longitude may not be null.');
    }

    $maxLatitude = $latitude + $gridSpacing;
    $minLatitude = $latitude - $gridSpacing;
    $maxLongitude = $longitude + $gridSpacing;
    $minLongitude = $longitude - $gridSpacing;

    try {
      $this->_query->bindValue(':region_id', safeintval($regionId),
          PDO::PARAM_INT);

      $this->_query->bindParam(':max_latitude', $maxLatitude);
      $this->_query->bindParam(':min_latitude', $minLatitude);

      $this->_query->bindParam(':max_longitude', $maxLongitude);
      $this->_query->bindParam(':min_longitude', $minLongitude);

      $this->_query->execute();

      $results = array_map(array($this, '_augmentResult'),
          $this->_query->fetchAll());
    } finally {
      $this->_query->closeCursor();
    }

    return $results;
  }

  /**
   * Insert a data value.
   *
   * @param latitude {Double}
   *      Decimal degrees latitude for point of interest.
   * @param longitude {Double}
   *      Decimal degrees longitude for point of interest.
   * @param region {Array}
   *      Associative array containing at least "id" and "grid_spacing" keys.
   * @throws {Exception}
   *         if unable to insert.
   */
  public function insert ($latitude, $longitude, $region, $data) {
    $regionId = $region['id'];

    $latitude = safefloatval($latitude);
    $longitude = safefloatval($longitude);

    if ($latitude === null) {
      throw new Exception('Latitude may not be null.');
    }

    if ($longitude === null) {
      throw new Exception('Longitude may not be null.');
    }

    $this->_insert->bindValue(':region_id', safeintval($regionId),
        PDO::PARAM_INT);
    $this->_insert->bindValue(':latitude', $latitude);
    $this->_insert->bindValue(':longitude', $longitude);
    $this->_insert->bindValue(':mapped_ss', $data['mapped_ss']);
    $this->_insert->bindValue(':mapped_s1', $data['mapped_s1']);
    $this->_insert->bindValue(':mapped_pga', $data['mapped_pga']);
    $this->_insert->bindValue(':crs', $data['crs']);
    $this->_insert->bindValue(':cr1', $data['cr1']);
    $this->_insert->bindValue(':geomean_ssd', $data['geomean_ssd']);
    $this->_insert->bindValue(':geomean_s1d', $data['geomean_s1d']);
    $this->_insert->bindValue(':geomean_pgad', $data['geomean_pgad']);

    $this->_insert->execute();
  }

  /**
   * Delete data values for a region.
   *
   * @param region {Array}
   *      Associative array containing at least "id" key.
   * @throws {Exception}
   *         if unable to delete.
   */
  public function delete ($region) {
    $regionId = $region['id'];

    $this->_delete->bindValue(':region_id', safeintval($regionId),
        PDO::PARAM_INT);

    $this->_delete->execute();
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
    return array(
      'latitude' => safefloatval($row['latitude']),
      'longitude' => safefloatval($row['longitude']),

      'mapped_ss' => safefloatval($row['mapped_ss']),
      'mapped_s1' => safefloatval($row['mapped_s1']),
      'mapped_pga' => safefloatval($row['mapped_pga']),

      'crs' => safefloatval($row['crs']),
      'cr1' => safefloatval($row['cr1']),

      'geomean_ssd' => safefloatval($row['geomean_ssd']),
      'geomean_s1d' => safefloatval($row['geomean_s1d']),
      'geomean_pgad' => safefloatval($row['geomean_pgad'])
    );
  }


  /**
   * @PrivateMethod
   *
   * Initializes database statements used by the class.
   */
  private function _initStatements () {
    $this->_query = $this->_db->prepare(
      '
        SELECT
          latitude,
          longitude,
          mapped_ss,
          mapped_s1,
          mapped_pga,
          crs,
          cr1,
          geomean_ssd,
          geomean_s1d,
          geomean_pgad
        FROM
          data
        WHERE
          region_id = :region_id
          AND latitude < :max_latitude
          AND latitude > :min_latitude
          AND longitude < :max_longitude
          AND longitude > :min_longitude
        ORDER BY
          latitude DESC,
          longitude ASC
      '
    );

    $this->_tlQuery = $this->_db->prepare(
     '
       With search AS (SELECT
         ST_SetSRID(ST_MakePoint(:latitude, :longitude),
             4326)::geography
         AS point
       )
       SELECT
         value
       FROM
         search, tl
       WHERE
         search.point && shape
       AND
         ST_Intersects(search.point, shape)
       ORDER BY
         value DESC
     '
   );

    $this->_insert = $this->_db->prepare(
      '
        INSERT INTO data
        (
          region_id,
          latitude,
          longitude,
          mapped_ss,
          mapped_s1,
          mapped_pga,
          crs,
          cr1,
          geomean_ssd,
          geomean_s1d,
          geomean_pgad
        ) values (
          :region_id,
          :latitude,
          :longitude,
          :mapped_ss,
          :mapped_s1,
          :mapped_pga,
          :crs,
          :cr1,
          :geomean_ssd,
          :geomean_s1d,
          :geomean_pgad
        )
      '
    );

    $this->_delete = $this->_db->prepare(
      'DELETE FROM data WHERE region_id = :region_id'
    );
  }


  public function computeTL ($latitude, $longitude) {
    $result = null;

    if ($latitude == null || $longitude == null) {
      throw new Exception('"latitude", and "longitude" are required');
    }


    try {
      $this->_tlQuery->bindValue(':latitude', $latitude);
      $this->_tlQuery->bindValue(':longitude', $longitude);
      $this->_tlQuery->execute();
      $row = $this->_tlQuery->fetch(PDO::FETCH_ASSOC);
      if ($row && isset($row['value'])) {
        $result = floatval($row['value']);
      }
    } finally {
      $this->_tlQuery->closeCursor();
    }
    return $result;
  }
}
