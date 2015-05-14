<?php

include_once '../install-funcs.inc.php';

class DataFactory {

  private $_db = null;
  private $_query = null;


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
   *      the requested location as inside a grid, on a grid edge, or on a grid
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
    $minLongitude = $longitude - $gridSPacing;

    try {
      $this->_query->bindValue(':region_id', safeintval($regionId),
          PDO::PARAM_INT);

      $this->query->bindParam(':max_latitude', $maxLatitude);
      $this->query->bindParam(':min_latitude', $minLatitude);

      $this->query->bindParam(':max_longitude', $maxLongitude);
      $this->query->bindParam(':min_longitude', $minLongitude);

      $this->_query->execute();

      $results = array_map(array($this, '_augmentResult'),
          $this->_query->fetchAll());
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
          geomean_ss,
          geomean_s1,
          geomean_pga
        FROM
          data
        WHERE
          region_id = :region_id
          AND latitude < :max_latitude,
          AND latitude > :min_latitude,
          AND longitude < :max_longitude,
          AND longitude > :min_longitude
        ORDER BY
          latitude DESC,
          longitude ASC
      '
    );
  }
}
