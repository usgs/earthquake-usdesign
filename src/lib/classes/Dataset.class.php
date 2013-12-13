<?php

/**
 * Data class representing a dataset.
 */
class Dataset {

	// single value attributes
	public $id;
	public $edition_id;
	public $region_id;
	public $fa_table_id;
	public $fv_table_id;
	public $fpga_table_id;
	public $grid_spacing;
	public $ss_max_direction_factor;
	public $s1_max_direction_factor;
	public $factor_84_percent;
	public $sec_0_0_det_floor;
	public $sec_0_2_det_floor;
	public $sec_1_0_det_floor;

	//multi valued attributes
	public $data_recs;
	public $tsubl_recs;

	public function __construct ($id=null, $edition_id=null, $region_id=null,
				$fa_table_id=null, $fv_table_id=null, $fpga_table_id=null,
				$grid_spacing=null, $ss_max_direction_factor=null,
				$s1_max_direction_factor=null, $factor_84_percent=null,
				$sec_0_0_det_floor=null, $sec_0_2_det_floor=null,
				$sec_1_0_det_floor=null, $data_recs=array(),
				$tsubl_recs=array()) {
		$this->id = $id;
		$this->edition_id = $edition_id;
		$this->region_id = $region_id;
		$this->fa_table_id = $fa_table_id;
		$this->fv_table_id = $fv_table_id;
		$this->fpga_table_id = $fpga_table_id;
		$this->grid_spacing = $grid_spacing;
		$this->ss_max_direction_factor = $ss_max_direction_factor;
		$this->s1_max_direction_factor = $s1_max_direction_factor;
		$this->factor_84_percent = $factor_84_percent;
		$this->sec_0_0_det_floor = $sec_0_0_det_floor;
		$this->sec_0_2_det_floor = $sec_0_2_det_floor;
		$this->sec_1_0_det_floor = $sec_1_0_det_floor;
		$this->data_recs = $data_recs;
		$this->tsubl_recs = $tsubl_recs;
	}

	public static function fromArray (&$p) {
		$data_recs = array();
		if (isset($p['data_recs'])) {
			foreach ($p['data_recs'] as $data) {
				$data_recs[] = Data::fromArray($data);
			}
		}
		$tsubl_recs = array();
		if (isset($p['tsubl_recs'])) {
			foreach ($p['tsubl_recs'] as $tsubl) {
				$tsubl_recs[] = Tsubl::fromArray($tsubl);
			}
		}
		return new Dataset($p['id'], $p['edition_id'], $p['region_id'],
					$p['fa_table_id'], $p['fv_table_id'], $p['fpga_table_id'],
					$p['grid_spacing'], $p['ss_max_direction_factor'],
					$p['ss_max_direction_factor'],
					$p['s1_max_direction_factor'], $p['factor_84_percent'],
					$p['sec_0_0_det_floor'], $p['sec_0_2_det_floor'],
					$p['sec_1_0_det_floor'], $data_recs, $tsubl_recs);
	}

	public function toArray () {
		return array('id' => $this->id,
					'edition_id' => $this->edition_id,
					'region_id' => $this->region_id,
					'fa_table_id' => $this->fa_table_id,
					'fv_table_id' => $this->fv_table_id,
					'fpga_table_id' => $this->fpga_table_id,
					'grid_spacing' => $this->grid_spacing,
					'ss_max_direction_factor' => $this->ss_max_direction_factor,
					's1_max_direction_factor' => $this->s1_max_direction_factor,
					'factor_84_percent' => $this->factor_84_percent,
					'sec_0_0_det_floor' => $this->sec_0_0_det_floor,
					'sec_0_2_det_floor' => $this->sec_0_2_det_floor,
					'sec_1_0_det_floor' => $this->sec_1_0_det_floor,
					'data_recs' => $this->data_recs,
					'tsubl_recs' => $this->tsubl_recs);
	}

}

?>
