<?php

/**
 * Factory for loading lookup list values from the database.
**/
class LookupFactory {

	private $db;

	const SCHEMA = 'US_DESIGN';

	/**
	 * Creates a new factory object.
	 *
	 * @param db {PDO}
	 *      The PDO database connection for this factory.
	 */
	public function __construct ($db) {
		$this->db = $db;	
	}

	/**
	 * Returns all data sources.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getDataSources () {
		$data_sources = array();
		$statement = $this->db->prepare('SELECT * FROM ' . self::SCHEMA .
				'.data_source ORDER BY display_order');

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$id = intval($row['id']);
				$edition_ids = $this->getEditionIdsByDataSource($id);
				$data_source = new DataSource($id, $row['title'],
						intval($row['display_order']), $edition_ids);
				$data_sources[] = $data_source;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $data_sources;
	}

	/**
	 * Returns all the design code variants.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getDesignCodeVariants () {
		$design_code_variants = array();
		$statement = $this->db->prepare('SELECT * FROM ' . self::SCHEMA .
				'.design_code_variant ORDER BY display_order');

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$design_code_variant = new DesignCodeVariant(intval($row['id']),
						intval($row['edition_id']), $row['code'],
						$row['requires_exceedence_probability'],
						intval($row['display_order']));
				$design_code_variants[] = $design_code_variant;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $design_code_variants;
	}

	/**
	 * Returns the design code variant ids for a single edition.
	 *
	 * @param edition_id {Integer}
	 *
	 * @return {Array{Integer}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getDesignCodeVariantIdsByEdition ($edition_id) {
		$design_code_variant_ids = array();
		$statement = $this->db->prepare('SELECT id FROM ' . self::SCHEMA .
				'.design_code_variant WHERE edition_id = :id ORDER BY ' .
				'display_order');
		$statement->bindParam(':id', $edition_id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$design_code_variant_ids[] = intval($row['id']);
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $design_code_variant_ids;
	}

	/**
	 * Returns all the editions.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getEditions () {
		$edition_ids = array();
		$statement = $this->db->prepare('SELECT * FROM '. self::SCHEMA .
				'.edition ORDER BY display_order');

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$id = intval($row['id']);
				$design_code_variant_ids = $this->
						getDesignCodeVariantIdsByEdition($id);
				$risk_category_ids = $this->getRiskCategoryIdsByEdition($id);
				$site_soil_class_ids = $this->getSiteSoilClassIdsByEdition($id);
				$edition = new Edition($id, $row['code'], $row['title'],
						intval($row['data_source_id']),
						intval($row['display_order']),
						$row['risk_category_label'], $design_code_variant_ids,
						$risk_category_ids, $site_soil_class_ids);
				$editions[] = $edition;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $editions;
	}

	/**
	 * Returns the edition ids for a single data source.
	 *
	 * @param data_source_id {Integer}
	 *
	 * @return {Array{Integer}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getEditionIdsByDataSource ($data_source_id) {
		$edition_ids = array();
		$statement = $this->db->prepare('SELECT id FROM '. self::SCHEMA .
				'.edition where data_source_id = :id ORDER BY display_order');
		$statement->bindParam(':id', $data_source_id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$edition_ids[] = intval($row['id']);
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $edition_ids;
	}

	/**
	 * Returns all the risk categories.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getRiskCategories () {
		$risk_categories = array();
		$statement = $this->db->prepare('SELECT id FROM '. self::SCHEMA .
				'.risk_category ORDER BY display_order');

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$risk_category = new RiskCategory(intval($row['id']),
						intval($row['edition_id']), $row['category'],
						intval($row['display_order']));
				$risk_categories[] = $risk_category;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $risk_categories;
	}

	/**
	 * Returns the risk category ids for a single edition.
	 *
	 * @param edition_id {Integer}
	 *
	 * @return {Array{Integer}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getRiskCategoryIdsByEdition ($edition_id) {
		$risk_category_ids = array();
		$statement = $this->db->prepare('SELECT id FROM '. self::SCHEMA .
				'.risk_category WHERE edition_id = :id ORDER BY display_order');
		$statement->bindParam(':id', $edition_id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$risk_category_ids[] = intval($row['id']);
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $risk_category_ids;
	}

	/**
	 * Returns all the site soil classes.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getSiteSoilClasses () {
		$site_soil_classes = array();
		$statement = $this->db->prepare('SELECT id, code, title, ' .
				'display_order FROM '. self::SCHEMA . '.site_soil_class '.
				'ORDER BY display_order');

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$site_soil_class = new SiteSoilClass(intval($row['id']),
						$row['code'], $row['title'],
						intval($row['display_order']));
				$site_soil_classes[] = $site_soil_class;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $site_soil_classes;
	}

	/**
	 * Returns the site soil class ids for a single edition.
	 *
	 * @param edition_id {Integer}
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getSiteSoilClassIdsByEdition ($edition_id) {
		$site_soil_classes = array();
		$statement = $this->db->prepare('SELECT A.id "id" FROM '. self::SCHEMA . 
				'.site_soil_class A INNER JOIN '. self::SCHEMA . 
				'.edition_site_soil_class B ON (A.id = B.site_soil_class_id) ' .
				'WHERE B.edition_id = :id');
		$statement->bindParam(':id', $edition_id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$site_soil_class_ids[] = intval($row['id']);
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $site_soil_class_ids;
	}

	private function triggerError (&$statement) {
		$error = $statement->errorInfo();
		$statement->closeCursor();

		$errorMessage = (is_array($error)&&isset($error[2])&&isset($error[0])) ?
				'[' . $error[0] . '] :: ' . $error[2] : 'Unknown SQL Error';
		$errorCode = (is_array($error)&&isset($error[1])) ?
				$error[1] : -999;

		throw new Exception($errorMessage, $errorCode);
	}

}

?>
