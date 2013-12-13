<?php

/**
 * Data class representing a U.S. Design data object.
 */
class Data {

	// single value attributes
	public $id;
	public $dataset_id;
	public $longitude;
	public $latitude;
	public $sec_0_0_uh;
	public $sec_0_2_uh;
	public $sec_1_0_uh;
	public $sec_0_2_cr;
	public $sec_1_0_cr;
	public $sec_0_0_det;
	public $sec_0_2_det;
	public $sec_1_0_det;
	public $ss;
	public $s1;

	public function __construct ($id=null, $dataset_id=null, $longitude=null,
				$latitude=null, $sec_0_0_uh=null, $sec_0_2_uh=null,
				$sec_1_0_uh=null, $sec_0_2_cr=null, $sec_1_0_cr=null,
				$sec_0_0_det, $sec_0_2_det=null, $sec_1_0_det=null, $ss=null,
				$s1=null) { 
		$this->id = $id;
		$this->dataset_id = $dataset_id;
		$this->longitude = $longitude;
		$this->latitude = $latitude;
		$this->sec_0_0_uh = $sec_0_0_uh;
		$this->sec_0_2_uh = $sec_0_2_uh;
		$this->sec_1_0_uh = $sec_1_0_uh;
		$this->sec_0_2_cr = $sec_0_2_cr;
		$this->sec_1_0_cr = $sec_1_0_cr;
		$this->sec_0_0_det = $sec_0_0_det;
		$this->sec_0_2_det = $sec_0_2_cr;
		$this->sec_1_0_det = $sec_1_0_det;
		$this->ss = $ss;
		$this->s1 = $s1;
	}

	public static function fromArray (&$p) {
		return new Data($p['id'], $p['dataset_id'], $p['longitude'],
					$p['latitude'], $p['sec_0_0_uh'], $p['sec_0_2_uh'],
					$p['sec_1_0_uh'], $p['sec_0_2_cr'], $p['sec_1_0_cr'],
					$p['sec_0_0_det'], $p['sec_0_2_det'], $p['sec_1_0_det'],
					$p['ss'], $p['s1']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'dataset_id' => $this->dataset_id,
					'longitude' => $this->longitude,
					'latitude' => $this->latitude,
					'sec_0_0_uh' => $this->sec_0_0_uh,
					'sec_0_2_uh' => $this->sec_0_2_uh,
					'sec_1_0_uh' => $this->sec_1_0_uh,
					'sec_0_2_cr' => $this->sec_0_2_cr,
					'sec_1_0_cr' => $this->sec_1_0_cr,
					'sec_0_0_det' => $this->sec_0_0_det,
					'sec_0_2_det' => $this->sec_0_2_det,
					'sec_1_0_det' => $this->sec_1_0_det,
					'ss' => $this->ss,
					's1' => $this->s1);
	}

}

?>
