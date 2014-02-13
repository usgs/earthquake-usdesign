<?php

/**
 * Data class representing a risk category.
 */
class RiskCategory {

	// single value attributes
	public $id;
	public $edition_id;
	public $category;

	public function __construct ($id=null, $edition_id=null, $category=null) {
		$this->id = $id;
		$this->edition_id = $edition_id;
		$this->category = $category;
	}

	public static function fromArray (&$p) {
		return new RiskCategory($p['id'], $p['edition_id'], $p['category']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'edition_id' => $this->edition_id,
					'catgeory' => $this->category);
	}

}

?>
