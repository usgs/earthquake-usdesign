<?php

/**
 * Factory for loading seismic design data from the database.
**/
class LookupFactory {

	private $db;

	const SCHEMA = 'US_DESIGN';

	/**
	 * Creates a new factory object.
	 *
	 * @param db {PDO}
	 *      The PDO database connection for this factory.
	 */
	public function __construct ($db) {
		$this->db = $db;	
	}

	/**
	 * Returns the data associated with a point, data set, and grid spacing.
	 *
	 * @param longitude {Double}
	 * @param latitude {Double}
	 * @param dataset_id {Integer}
	 * @param grid_spacing {Double}
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getDataForPointAndDatasetAndGridSpacing ($longitude,
				$latitude, $dataset_id, $grid_spacing) {
		$data_recs = array();
		if (!is_null($design_code_variant_id)) {
			$sql = $sql + ' AND design_code_variant_id = :did';
		}
		$statement = $this->db->prepare('SELECT * FROM ' . self::SCHEMA .
				'.data WHERE dataset_id = :did AND longitude < CAST(' .
				':lon AS DOUBLE PRECISION) + CAST(:gs AS DOUBLE PRECSION) ' .
				'AND longitude > CAST(:lon AS DOUBLE PRECISION) - ' .
				'CAST(:gs AS DOUBLE PRECSION) AND latitude < CAST(:lat AS ' .
				'DOUBLE PRECSION) + CAST(:gs AS DOUBLE PRECISION) AND ' .
				'latitude > CAST(:lat AS DOUBLE PRECISION) - CAST(:gs AS ' .
				'DOUBLE PRECISION) ORDER BY latitude DESC, longitude ASC');
		$statement->bindParam(':did', $dataset_id, PDO::PARAM_INT);
		$statement->bindParam(':lon', strval($longitude));
		$statement->bindParam(':lat', strval($latitude));
		$statement->bindParam(':gs', strval($grid_spacing));

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$data = new Data(intval($row['id']),
					intval($row['dataset_id']),
					doubleval($row['longitude']),
					doubleval($row['latitude']),
					doubleval($row['sec_0_0_uh']),
					doubleval($row['sec_0_2_uh']),
					doubleval($row['sec_1_0_uh']),
					doubleval($row['sec_0_2_cr']),
					doubleval($row['sec_1_0_cr']),
					doubleval($row['sec_0_0_det']),
					doubleval($row['sec_0_2_det']),
					doubleval($row['sec_1_0_det']),
					doubleval($row['ss']), doubleval($row['s1']));
				$data_recs[] = $data;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $data_recs;
	}

	/**
	 * Returns the data set associated with a region, edition, and optional 
	 * design code variant (or null if there isn't one).
	 *
	 * @param region_id {Integer}
	 * @param edition_id {Integer}
	 * @param design_code_variant_id {Integer}
	 *
	 * @return {Dataset}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getDatasetForRegionAndEdition ($longitude, $latitude, 
				$edition_id, $design_code_variant_id) {
		$dataset = null;
		$region = getRegionFromPoint($longitude, $latitude);
		if (!is_null($region)) {
			$sql = 'SELECT * FROM ' . self::SCHEMA .
				'.dataset WHERE region_id = :rid AND edition_id = :eid';
			if (!is_null($design_code_variant_id)) {
				$sql = $sql + ' AND design_code_variant_id = :did';
			}
			$statement = $this->db->prepare($sql);
			$statement->bindParam(':rid', $region->id, PDO::PARAM_INT);
			$statement->bindParam(':eid', $edition_id, PDO::PARAM_INT);
			if (!is_null($design_code_variant_id)) {
				$statement->bindParam(':did', $design_code_variant_id,
						PDO::PARAM_INT);
			}

			if ($statement->execute()) {
				$row = $statement->fetch(PDO::FETCH_ASSOC);
				if ($row) {
					$dataset_id = intval($row['id']);
					$grid_spacing_id = doubleval($row['grid_spacing']);
					$data_recs = $this->getDataByPointAndDatasetAndGridSpacing(
							$longitude, $latitude, $dataset_id, $grid_spacing);
					$dataset = new Dataset(intval($dataset_id),
							intval($row['edition_id']),
							intval($row['region_id']),
							intval($row['fa_table_id']),
							intval($row['fv_table_id']),
							intval($row['fpga_table_id']), $grid_spacing,
							doubleval($row['ss_max_direction_factor']),
							doubleval($row['s1_max_direction_factor']),
							doubleval($row['factor_84_percent']),
							doubleval($row['sec_0_0_det_floor']),
							doubleval($row['sec_0_2_det_floor']),
							doubleval($row['sec_1_0_det_floor']),
							intval($row['design_code_variant_id']), $data_recs);
				}
			} else {
				$this->triggerError($statement);
			}
		}

		$statement->closeCursor();

		return $dataset;
	}

	/**
	 * Returns the region associated with a point (or null if there isn't one).
	 *
	 * @param longitude {Double}
	 * @param latitude {Double}
	 *
	 * @return {Region}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getRegionFromPoint ($longitude, $latitude) { 
		$region = null;
		$statement = $this->db->prepare('SELECT * FROM ' . self::SCHEMA .
				'.region WHERE CAST(:lon AS DOUBLE PRECISION) >= ' .
				'min_longitude AND CAST(:lon AS DOUBLE PRECISION) <= ' .
				'max_longitude AND CAST(:lat AS DOUBLE PRECISION) >= ' .
				'min_latitude AND CAST(:lat AS DOUBLE PRECISION) <= ' .
				'max_latitude ORDER by priority asc');
		$statement->bindParam(':lon', strval($longitude));
		$statement->bindParam(':lat', strval($latitude));

		if ($statement->execute()) {
			$row = $statement->fetch(PDO::FETCH_ASSOC);
			if($row) {
				$region = new Region(intval($row['id']),
						$row['name'], doubleval($row['min_longitude']),
						doubleval($row['max_longitude']),
						doubleval($row['min_latitude']),
						doubleval($row['max_latitude']),
						doubleval($row['priority']));
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $region;
	}

	/**
	 * Returns the T subl value for a point.
	 *
	 * @param longitude {Double}
	 * @param latitude {Double}
	 *
	 * @return {TsublValue}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getTsublValueForPoint ($longitude, $latitude) { 
		$statement = $this->db->prepare('SELECT TSUBL_VALUE(:longitude, ' .
				':latitude) "VALUE"');
		$statement->bindParam(':longitude', strval($longitude));
		$statement->bindParam(':latitude', strval($latitude));

		if ($statement->execute()) {
			$row = $statement->fetch(PDO::FETCH_ASSOC);
			if ($row) {
				$tsubl_value = new TsublValue(intval($row['value']),
						$longitude, $latitude);
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $region;
	}

	private function triggerError (&$statement) {
		$error = $statement->errorInfo();
		$statement->closeCursor();

		$errorMessage = (is_array($error)&&isset($error[2])&&isset($error[0])) ?
				'[' . $error[0] . '] :: ' . $error[2] : 'Unknown SQL Error';
		$errorCode = (is_array($error)&&isset($error[1])) ?
				$error[1] : -999;

		throw new Exception($errorMessage, $errorCode);
	}

}

?>
