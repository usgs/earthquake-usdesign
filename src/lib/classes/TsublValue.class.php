<?php

/**
 * Data class representing a tsubl value entity.
 */
class TsublValue {

	// single value attributes
	public $longitude;
	public $latitude;
	public $value;

	public function __construct ($longitude=null, $latitude=null, $value=null) {
		$this->longitude = $longitude;
		$this->latitude = $latitude;
		$this->value = $value;
	}

	public static function fromArray (&$p) {
		return new TsublValue($p['longitude'], $p['latitude'], $p['value']);
	}

	public function toArray () {
		return array('longitude' => $this->longitude,
					'latitude' => $this->latitude,
					'value' => $this->value);
	}

}

?>
