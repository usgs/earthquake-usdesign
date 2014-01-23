<?php

/**
 * Data class representing a region.
 */
class Region {

	// single value attributes
	public $id;
	public $name;
	public $min_longitude;
	public $max_longitude;
	public $min_latitude;
	public $max_latitude;
	public $priority;

	public function __construct ($id=null, $name=null, $min_longitude=null,
				$max_longitude=null, $min_latitude=null, $max_latitude=null,
				$priority=null) {
		$this->id = $id;
		$this->name = $name;
		$this->min_longitude = $min_longitude;
		$this->max_longitude = $max_longitude;
		$this->min_latitude = $min_latitude;
		$this->max_latitude = $max_latitude;
		$this->priority = $priority;
	}

	public static function fromArray (&$p) {
		return new Region($p['id'], $p['name'], $p['min_longitude'],
					$p['max_longitude'], $p['min_latitude'],
					$p['max_latitude'], $p['priority']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'name' => $this->name,
					'min_longitude' => $this->min_longitude,
					'max_longitude' => $this->max_longitude,
					'min_latitude' => $this->min_latitude,
					'max_latitude' => $this->max_latitude,
					'priority' => $this->priority);
	}

}

?>
