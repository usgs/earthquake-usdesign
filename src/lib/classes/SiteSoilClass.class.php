<?php

/**
 * Data class representing a site soil class.
 */
class SiteSoilClass {

	// single value attributes
	public $id;
	public $code;
	public $title;

	public function __construct ($id=null, $code=null, $title=null) {
		$this->id = $id;
		$this->code = $code;
		$this->title = $title;
	}

	public static function fromArray (&$p) {
		return new SiteSoilClass($p['id'], $p['code'], $p['title']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'code' => $this->code,
					'title' => $this->title);
	}

}

?>
