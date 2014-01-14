<?php

/**
 * Data class representing an edition.
 */
class Edition {

	// single value attributes
	public $id;
	public $code;
	public $title;
	public $data_source_id;
	public $display_order;
	public $risk_category_label;

	//multi valued attributes
	public $design_code_variant_ids;
	public $region_ids;
	public $risk_category_ids;
	public $site_soil_class_ids;

	public function __construct ($id=null, $code=null, $title=null,
				$data_source_id=null, $display_order=null,
				$risk_category_label=null, $design_code_variant_ids=array(),
				$region_ids=array(), $risk_category_ids=array(),
				$site_soil_class_ids=array()) {
		$this->id = $id;
		$this->code = $code;
		$this->title = $title;
		$this->data_source_id = $data_source_id;
		$this->display_order = $display_order;
		$this->risk_category_label = $risk_category_label;
		$this->design_code_variant_ids = $design_code_variant_ids;
		$this->region_ids = $region_ids;
		$this->risk_category_ids = $risk_category_ids;
		$this->site_soil_class_ids = $site_soil_class_ids;
	}

	public static function fromArray (&$p) {
		$design_code_variant_ids = array();
		if (isset($p['design_code_variant_ids'])) {
			foreach ($p['design_code_variant_ids'] as $design_code_variant_id) {
				$design_code_variant_ids[] = $design_code_variant_id;
			}
		}
		$region_ids = array();
		if (isset($p['region_ids'])) {
			foreach ($p['region_ids'] as $region_id) {
				$region_ids[] = $region_id;
			}
		}
		$risk_category_ids = array();
		if (isset($p['risk_category_ids'])) {
			foreach ($p['risk_category_ids'] as $risk_category_id) {
				$risk_category_ids[] = $risk_category_id;
			}
		}
		$site_soil_class_ids = array();
		if (isset($p['site_soil_class_ids'])) {
			foreach ($p['site_soil_class_ids'] as $site_soil_class_id) {
				$site_soil_class_ids[] = $site_soil_class_id;
			}
		}
		return new Edition($p['id'], $p['code'], $p['title'],
					$p['data_source_id'], $p['display_order'],
					$p['risk_category_label'], $design_code_variant_ids,
					$region_ids, $risk_category_ids, $site_soil_class_ids);
	}

	public function toArray () {
		return array('id' => $this->id,
					'code' => $this->code,
					'title' => $this->title,
					'data_source_id' => $this->data_source_id,
					'display_order' => $this->display_order,
					'risk_category_label' => $this->risk_category_label,
					'design_code_variant_ids' => $this->design_code_variant_ids,
					'region_ids' => $this->region_ids,
					'risk_category_ids' => $this->risk_category_ids,
					'site_soil_class_ids' => $this->site_soil_class_ids);
	}

}

?>
