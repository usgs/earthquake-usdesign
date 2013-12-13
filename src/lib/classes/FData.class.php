<?php

/**
 * Data class representing an "F" table view data record.
 */
class FData {

	// single value attributes
	public $dataset_id;
	public $site_soil_class_id;
	public $ss_min;
	public $ss_max;
	public $s1_min;
	public $s1_max;
	public $pga_min;
	public $pga_max;
	public $fa;
	public $fv;
	public $fpga;

	public function __construct ($dataset_id=null, $site_soil_class_id=null,
				$ss_min=null, $ss_max=null, $s1_min=null, $s1_max=null, 
				$pga_min=null, $pga_max=null, $fa=null, $fv=null, $fpga=null) {
		$this->dataset_id = $dataset_id;
		$this->site_soil_class_id = $site_soil_class_id;
		$this->ss_min = $ss_min;
		$this->ss_max = $ss_max;
		$this->s1_min = $s1_min;
		$this->s1_max = $s1_max;
		$this->pga_min = $pga_min;
		$this->pga_max = $pga_max;
		$this->fa = $fa;
		$this->fv = $fv;
		$this->fpga = $fpga;
	}

	public static function fromArray (&$p) {
		return new FData($p['dataset_id'], $p['site_soil_class_id'],
					$p['ss_min'], $p['ss_max'], $p['s1_min'],  $p['s1_max'],
					$p['pga_min'], $p['pga_max'], $p['fa'],  $p['fv'],
					$p['fpga']); 
	}

	public function toArray () {
		return array('dataset_id' => $this->dataset_id,
					'site_soil_class_id' => $this->site_soil_class_id,
					'ss_min' => $this->ss_min,
					'ss_max' => $this->ss_max,
					's1_min' => $this->s1_min,
					's1_max' => $this->s1_max,
					'pga_min' => $this->pga_min,
					'pga_max' => $this->pga_max,
					'fa' => $this->fa,
					'fv' => $this->fv,
					'fpga' => $this->fpga);
	}

}

?>
