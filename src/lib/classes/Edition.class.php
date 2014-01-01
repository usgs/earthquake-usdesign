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
	public $design_code_variants;
	public $risk_categories;
	public $site_soil_classes;

	public function __construct ($id=null, $code=null, $title=null,
				$data_source_id=null, $display_order=null,
				$risk_category_label=null, $design_code_variants=array(),
				$risk_categories=array(), $site_soil_classes=array()) {
		$this->id = $id;
		$this->code = $code;
		$this->title = $title;
		$this->data_source_id = $data_source_id;
		$this->display_order = $display_order;
		$this->risk_category_label = $risk_category_label;
		$this->design_code_variants = $design_code_variants;
		$this->risk_categories = $risk_categories;
		$this->site_soil_classes = $site_soil_classes;
	}

	public static function fromArray (&$p) {
		$design_code_variants = array();
		if (isset($p['design_code_variants'])) {
			foreach ($p['design_code_variants'] as $design_code_variant) {
				$design_code_variants[] =
						DesignCodeVariant::fromArray($design_code_variant);
			}
		}
		$risk_categories = array();
		if (isset($p['risk_categories'])) {
			foreach ($p['risk_categories'] as $risk_category) {
				$risk_categories[] = RiskCategory::fromArray($risk_category);
			}
		}
		$site_soil_classes = array();
		if (isset($p['site_soil_classes'])) {
			foreach ($p['site_soil_classes'] as $site_soil_class) {
				$site_soil_classes[] =
						SiteSoilClass::fromArray($site_soil_class);
			}
		}
		return new Edition($p['id'], $p['code'], $p['title'],
					$p['data_source_id'], $p['display_order'],
					$p['risk_category_label'], $design_code_variants,
					$risk_categories, $site_soil_classes);
	}

	public function toArray () {
		return array('id' => $this->id,
					'code' => $this->code,
					'title' => $this->title,
					'data_source_id' => $this->data_source_id,
					'display_order' => $this->display_order,
					'risk_category_label' => $this->risk_category_label,
					'design_code_variants' => $this->design_code_variants,
					'risk_categories' => $this->risk_categories,
					'site_soil_classes' => $this->site_soil_classes);
	}

}

?>
