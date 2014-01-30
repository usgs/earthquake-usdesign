<?php

/**
 * Data class representing a data source.
 */
class DataSource {

	// single value attributes
	public $id;
	public $title;

	//multi valued attributes
	public $edition_ids;

	public function __construct ($id=null, $title=null, $edition_ids=array()) {
		$this->id = $id;
		$this->title = $title;
		$this->edition_ids = $edition_ids;
	}

	public static function fromArray (&$p) {
		$edition_ids = array();
		if (isset($p['edition_ids'])) {
			foreach ($p['edition_ids'] as $edition_id) {
				$edition_ids[] = $edition_id;
			}
		}
		return new DataSource($p['id'], $p['title'], $edition_ids);
	}

	public function toArray () {
		return array('id' => $this->id,
					'title' => $this->title,
					'edition_ids' => $this->edition_ids);
	}

}

?>
