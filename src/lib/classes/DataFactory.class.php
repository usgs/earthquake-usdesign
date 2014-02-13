<?php

/**
 * Factory for loading seismic design data from the database.
**/
class DataFactory {

	private $db;
	private $schema;

	/**
	 * Creates a new factory object.
	 *
	 * @param db {PDO}
	 *      The PDO database connection for this factory.
	 * @param schema {String}
	 *      The schema that owns the database objects.
	 */
	public function __construct ($db, $schema) {
		$this->db = $db;
		$this->schema = $schema;
	}

	/**
	 * Returns the data associated with a point, data group, and grid spacing.
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
	public function getDataForPointAndDataGroupAndGridSpacing ($longitude,
				$latitude, $data_group_id, $grid_spacing) {
		$data_recs = array();
		$statement = $this->db->prepare('SELECT * FROM ' . $this->schema .
				'.data WHERE data_group_id = :did AND longitude < CAST(' .
				':lon AS NUMERIC) + CAST(:gs AS DOUBLE PRECISION) ' .
				'AND longitude > CAST(:lon AS NUMERIC) - ' .
				'CAST(:gs AS DOUBLE PRECISION) AND latitude < CAST(:lat AS ' .
				'NUMERIC) + CAST(:gs AS DOUBLE PRECISION) AND ' .
				'latitude > CAST(:lat AS NUMERIC) - CAST(:gs AS ' .
				'DOUBLE PRECISION) ORDER BY latitude DESC, longitude ASC');
		$statement->bindParam(':did', $data_group_id, PDO::PARAM_INT);
		$slon = strval($longitude);
		$slat = strval($latitude);
		$sgs = strval($grid_spacing);
		$statement->bindParam(':lon', $slon);
		$statement->bindParam(':lat', $slat);
		$statement->bindParam(':gs', $sgs);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$data = new Data(intval($row['id']),
						intval($row['data_group_id']),
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
	 * Convenience method that extracts data group id and grid spacing from 
	 * a dataset object and then retrieves the associated data.
	 *
	 * @param longitude {Double}
	 * @param latitude {Double}
	 * @param dataset {Object}
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getDataForPointAndDatasetObject ($longitude, $latitude,
				$dataset) {
		if (is_null($dataset)) {
			return null;
		} else {
			return $this->getDataForPointAndDataGroupAndGridSpacing($longitude,
					$latitude, $dataset->data_group_id, $dataset->grid_spacing);
		}
	}

	/**
	 * Returns the data set associated with a point, edition, and optional 
	 * design code variant (or null if there isn't one).
	 *
	 * @param longitude {Double}
	 * @param latitude {Double}
	 * @param edition_id {Integer}
	 * @param design_code_variant_id {Integer}
	 *
	 * @return {Dataset}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getDatasetForPointAndEdition ($longitude, $latitude, 
				$edition_id, $design_code_variant_id) {
		$dataset = null;
		$region = $this->getRegionFromPoint($longitude, $latitude);
		if (!is_null($region)) {
			$sql = 'SELECT * FROM ' . $this->schema .
				'.dataset WHERE region_id = :rid AND edition_id = :eid';
			if (is_null($design_code_variant_id)) {
				// Return nothing if design_code_variance_id is required
				$sql .= ' AND design_code_variant_id is null';
			} else {
				$sql .= ' AND design_code_variant_id = :did';
			}
			$statement = $this->db->prepare($sql);
			$region_id = $region->id;
			$statement->bindParam(':rid', $region_id, PDO::PARAM_INT);
			$statement->bindParam(':eid', $edition_id, PDO::PARAM_INT);
			if (!is_null($design_code_variant_id)) {
				$statement->bindParam(':did', $design_code_variant_id,
						PDO::PARAM_INT);
			}

			if ($statement->execute()) {
				$row = $statement->fetch(PDO::FETCH_ASSOC);
				if ($row) {
					$dataset = new Dataset(intval($row['id']),
							intval($row['data_group_id']),
							intval($row['edition_id']),
							intval($row['design_code_variant_id']),
							intval($row['region_id']),
							intval($row['fa_table_id']),
							intval($row['fv_table_id']),
							intval($row['fpga_table_id']),
							doubleval($row['grid_spacing']),
							doubleval($row['ss_max_direction_factor']),
							doubleval($row['s1_max_direction_factor']),
							doubleval($row['factor_84_percent']),
							doubleval($row['sec_0_0_det_floor']),
							doubleval($row['sec_0_2_det_floor']),
							doubleval($row['sec_1_0_det_floor']));
				}
			} else {
				$this->triggerError($statement);
			}
			$statement->closeCursor();
		}

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
		$statement = $this->db->prepare('SELECT * FROM ' . $this->schema .
				'.region WHERE CAST(:lon AS NUMERIC) >= ' .
				'min_longitude AND CAST(:lon AS NUMERIC) <= ' .
				'max_longitude AND CAST(:lat AS NUMERIC) >= ' .
				'min_latitude AND CAST(:lat AS NUMERIC) <= ' .
				'max_latitude ORDER by priority desc');
		$slon = strval($longitude);
		$slat = strval($latitude);
		$statement->bindParam(':lon', $slon);
		$statement->bindParam(':lat', $slat);

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
	 * Returns the TsubL value for a point.
	 *
	 * @param longitude {Double}
	 * @param latitude {Double}
	 *
	 * @return {Integer}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getTsubLForPoint ($longitude, $latitude) {
		$tsubl = null;
		$statement = $this->db->prepare('SELECT ' . $this->schema .
				'.TSUBL_VALUE(CAST(:lon AS NUMERIC), ' .
				'CAST(:lat AS NUMERIC)) "value"');
		$slon = strval($longitude);
		$slat = strval($latitude);
		$statement->bindParam(':lon', $slon);
		$statement->bindParam(':lat', $slat);

		if ($statement->execute()) {
			$row = $statement->fetch(PDO::FETCH_ASSOC);
			if ($row) {
				$tsubl = intval($row['value']);
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $tsubl;
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
