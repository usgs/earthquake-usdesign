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

	//multi valued attributes
	public $editions;
	public $f_data_recs;

	public function __construct ($id=null, $code=null, $title=null,
				$display_order=null, $editions=array(), $f_data_recs=array()) {
		$this->id = $id;
		$this->code = $code;
		$this->title = $title;
		$this->display_order = $display_order;
		$this->editions = $editions;
		$this->f_data_recs = $f_data_recs;
	}

	public static function fromArray (&$p) {
		$editions = array();
		if (isset($p['editions'])) {
			foreach ($p['editions'] as $edition) {
				$editions[] = Edition::fromArray($edition);
			}
		}
		$f_data_recs = array();
		if (isset($p['f_data_recs'])) {
			foreach ($p['f_data_recs'] as $f_data) {
				$f_data_recs[] = FData::fromArray($f_data);
			}
		}
		return new SiteSoilClass($p['id'], $p['code'], $p['title'],
					$p['display_order'], $editions, $f_data_recs);
	}

	public function toArray () {
		return array('id' => $this->id,
					'code' => $this->code,
					'title' => $this->title,
					'display_order' => $this->display_order,
					'f_data_recs' => $this->f_data_recs,
					'editions' => $this->editions);
	}

}

?>
