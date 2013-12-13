<?php

/**
 * Data class representing a tsubl (spatial data) entity.
 */
class Tsubl {

	// single value attributes
	public $objectid;
	public $dataset_id;
	public $value;
	public $shape;
	public $se_anno_cad_data;

	public function __construct ($objectid=null, $dataset_id=null, $value=null,
				$shape=null, $se_anno_cad_data=null) {
		$this->objectid = $objectid;
		$this->dataset_id = $dataset_id;
		$this->value = $value;
		$this->shape = $shape;
		$this->se_anno_cad_data = $se_anno_cad_data;
	}

	public static function fromArray (&$p) {
		return new Tsubl($p['objectid'], $p['dataset_id'], $p['value'],
					$p['shape'], $p['se_anno_cad_data']);
	}

	public function toArray () {
		return array('objectid' => $this->objectid,
					'dataset_id' => $this->dataset_id,
					'value' => $this->value,
					'shape' => $this->shape,
					'se_anno_cad_data' => $this->se_anno_cad_data);
	}

}

?>
