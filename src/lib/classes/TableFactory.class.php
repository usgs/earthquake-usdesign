<?php

/**
 * Factory for loading report table data from the database.
**/
class TableFactory {

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
	 * Returns all "F" tables.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getFTables () {
		$f_tables = array();		
		$statement = $this->db->prepare('SELECT * FROM ' . self::SCHEMA .
				'.f_table');
		$statement2 = $this->db->prepare('SELECT * FROM ' . self::SCHEMA .
				'.f_data_vw WHERE f_table_id=:fid');

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$id = intval($row['id']);
				$type = $row['type'];

				$header_field = 'ss_val';
				$data_field = 'fa';
				if ($type === 'fv') {
					$header_field = 's1_val';
					$data_field = 'fv';
				}
				else if ($type === 'fpga') {
					$header_field = 'pga_val';
					$data_field = 'fpga';
				}

				$statement2->bindParam(':fid', $id, PDO::PARAM_INT);
				if ($statement2->execute()) {
					$data_rows = array();
					$data_row = null;
					$header_values = null;
					$first_group = true;
					$last_code = '*';
					while ($row2 = $statement2->fetch(PDO::FETCH_ASSOC)) {
						$code = $row2['site_soil_class_code'];
						if ($code !== $last_code) {
							// new data row
							if (!is_null($data_row)) { // dump last data row
								$data_rows[$last_code] = $data_row;
							}
							$data_row = array();
							if (is_null($header_values)) {
								$header_values = array();
							} else {
								$first_group = false;
							}
						}
						$last_code = $code;
						if ($first_group) {
							$header_values[] = doubleval($row2[$header_field]);
						}
						$data_row[] = doubleval($row2[$data_field]);
					}
					// dump final data row
					$data_rows[$last_code] = $data_row;
					$f_table = new FTable(intval($row['id']), $row['type'],
							$header_values, $data_rows);
					$f_tables[] = $f_table;
				} else {
					$this->triggerError($statement2);
				}
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();
		$statement2->closeCursor();

		return $f_tables;
	}

	/**
	 * Returns all risk category tables.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getRiskTables () {
		$risk_tables = array();
		$statement = $this->db->prepare('SELECT * FROM ' . self::SCHEMA .
				'.risk_table ORDER BY table_type DESC');
		$statement2 = $this->db->prepare('SELECT * FROM ' . self::SCHEMA .
				'.risk_table_vw WHERE edition_id=:eid AND table_type=:tt');

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$edition_id = intval($row['edition_id']);
				$table_type = $row['table_type'];
				$statement2->bindParam(':eid', $edition_id, PDO::PARAM_INT);
				$statement2->bindParam(':tt', $table_type);
				if ($statement2->execute()) {
					$header_values = array();
					$data_rows = array();
					$first = true;
					while ($row2 = $statement2->fetch(PDO::FETCH_ASSOC)) {
						if ($first) { // header values
							$header_values[] = $row2['category1'];
							$header_values[] = $row2['category2'];
							$header_values[] = $row2['category3'];
						} else { // data
							$categories = array();
							$categories[] = $row2['category1'];
							$categories[] = $row2['category2'];
							$categories[] = $row2['category3'];
							$data_rows[$row2['s_value']] = $categories;
						}
						$first = false;
					}
					$risk_table = new RiskTable(intval($row['id']),
							intval($row['edition_id']), $row['table_type'],
							$header_values, $data_rows);
					$risk_tables[] = $risk_table;
				} else {
					$this->triggerError($statement2);
				}
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();
		$statement2->closeCursor();

		return $risk_tables;
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
