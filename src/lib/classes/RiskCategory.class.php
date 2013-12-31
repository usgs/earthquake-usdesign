<?php

/**
 * Data class representing a risk category.
 */
class RiskCategory {

	// single value attributes
	public $id;
	public $edition_id;
	public $category;
	public $display_order;

	public function __construct ($id=null, $edition_id=null, $category=null,
				$display_order=null) {
		$this->id = $id;
		$this->edition_id = $edition_id;
		$this->category = $category;
		$this->display_order = $display_order;
	}

	public static function fromArray (&$p) {
		return new RiskCategory($p['id'], $p['edition_id'], $p['category'],
					$p['display_order']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'edition_id' => $this->edition_id,
					'catgeory' => $this->category,
					'display_order' => $this->display_order);
	}

}

?>
