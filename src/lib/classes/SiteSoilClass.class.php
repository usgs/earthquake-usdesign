<?php

/**
 * Data class representing a site soil class.
 */
class SiteSoilClass {

	// single value attributes
	public $id;
	public $code;
	public $title;
	public $display_order;

	public function __construct ($id=null, $code=null, $title=null,
				$display_order=null) {
		$this->id = $id;
		$this->code = $code;
		$this->title = $title;
		$this->display_order = $display_order;
	}

	public static function fromArray (&$p) {
		return new SiteSoilClass($p['id'], $p['code'], $p['title'],
					$p['display_order']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'code' => $this->code,
					'title' => $this->title,
					'display_order' => $this->display_order);
	}

}

?>
