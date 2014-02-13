<?php

/**
 * Data class representing an "F" table. Note: Header value and data row arrays
 * store actual values rather than classes.
 */
class FTable {

	// single value attributes
	public $id;
	public $type;

	//multi valued attributes
	public $header_values;
	public $data_rows;

	public function __construct ($id=null, $type=null,
				$header_values=array(), $data_rows=array()) {
		$this->id = $id;
		$this->type = $type;
		$this->header_values = $header_values;
		$this->data_rows = $data_rows;
	}

	public static function fromArray (&$p) {
		return new FTable($p['id'], $p['type'], $header_values, $data_rows);
	}

	public function toArray () {
		return array('id' => $this->id,
					'type' => $this->type,
					'header_values' => $this->header_values,
					'data_rows' => $this->data_rows);
	}

}

?>
