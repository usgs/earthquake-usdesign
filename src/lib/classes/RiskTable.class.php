<?php

/**
 * Data class representing a risk category table. Note: Header value and data
 * row arrays store actual values rather than classes.
 */
class RiskTable {

	// single value attributes
	public $id;
	public $edition_id;
	public $table_type;

	//multi valued attributes
	public $header_values;
	public $data_rows;

	public function __construct ($id=null, $edition_id=null, $table_type=null,
				$headers=array(), $data_rows=array()) {
		$this->id = $id;
		$this->edition_id = $edition_id;
		$this->table_type = $table_type;
		$this->headers = $headers;
		$this->data_rows = $data_rows;
	}

	public static function fromArray (&$p) {
		return new RiskTable($p['id'], $p['edition_id'], $p['table_type'],
					$header_values, $data_rows);
	}

	public function toArray () {
		return array('id' => $this->id,
					'edition_id' => $this->edition_id,
					'table_type' => $this->table_type,
					'headers' => $this->headers,
					'data_rows' => $this->data_rows);
	}

}

?>
