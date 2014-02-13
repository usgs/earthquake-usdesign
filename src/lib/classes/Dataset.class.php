<?php

/**
 * Data class representing a dataset.
 */
class Dataset {

	// single value attributes
	public $id;
	public $data_group_id;
	public $edition_id;
	public $design_code_variant_id;
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

	public function __construct ($id=null, $data_group_id, $edition_id=null,
				$design_code_variant_id, $region_id=null, $fa_table_id=null,
				$fv_table_id=null, $fpga_table_id=null, $grid_spacing=null,
				$ss_max_direction_factor=null, $s1_max_direction_factor=null,
				$factor_84_percent=null, $sec_0_0_det_floor=null,
				$sec_0_2_det_floor=null, $sec_1_0_det_floor=null) {
		$this->id = $id;
		$this->data_group_id = $data_group_id;
		$this->edition_id = $edition_id;
		$this->design_code_variant_id = $design_code_variant_id;
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
	}

	public static function fromArray (&$p) {
		return new Dataset($p['id'], $p['data_group_id'], $p['edition_id'],
					$p['design_code_variant_id'], $p['region_id'],
					$p['fa_table_id'], $p['fv_table_id'], $p['fpga_table_id'],
					$p['grid_spacing'], $p['ss_max_direction_factor'],
					$p['ss_max_direction_factor'],
					$p['s1_max_direction_factor'], $p['factor_84_percent'],
					$p['sec_0_0_det_floor'], $p['sec_0_2_det_floor'],
					$p['sec_1_0_det_floor']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'data_group_id' => $this->data_group_id,
					'edition_id' => $this->edition_id,
					'design_code_variant_id' => $this->design_code_variant_id,
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
					'sec_1_0_det_floor' => $this->sec_1_0_det_floor);
	}

}

?>
