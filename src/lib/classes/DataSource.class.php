<?php

/**
 * Data class representing a data source.
 */
class DataSource {

	// single value attributes
	public $id;
	public $title;
	public $display_order;

	//multi valued attributes
	public $editions;

	public function __construct ($id=null, $title=null, $display_order=null,
				$editions=array()) {
		$this->id = $id;
		$this->title = $title;
		$this->display_order = $display_order;
		$this->editions = $editions;
	}

	public static function fromArray (&$p) {
		$editions = array();
		if (isset($p['editions'])) {
			foreach ($p['editions'] as $edition) {
				$editions[] = Edition::fromArray($edition);
			}
		}
		return new DataSource($p['id'], $p['title'], $p['display_order'],
					$editions);
	}

	public function toArray () {
		return array('id' => $this->id,
					'title' => $this->title,
					'display_order' => $this->display_order,
					'editions' => $this->editions);
	}

}

?>
