<?php

	if (count($argv) < 1) {
		print "Usage: php LookupFactory.test.php\n";
		exit(-1);
	}

	if (!function_exists('notify')) {
		function notify ($testName, $expectation, $actual) {
			$passed = ($expectation == $actual);

			printf("[%s] Running test '%s' %s\n",
				$passed ? 'Passed' : 'Failed',
				$testName,
				($passed) ? '' : sprintf("(Expected '%s' received '%s')",
						$expectation, $actual)
			);

		}
	}

	include_once '../../../src/conf/config.inc.php';

	try {
		// ----- Tests ----- //

		$data_sources = $LOOKUP_FACTORY->getDataSources();
		notify('Get data sources', 3, count($data_sources));
		$data_source = $data_sources[1];
		notify('Check title for second data source', 
				'Derived from USGS Hazard Data available in 2008',
				$data_source->title);
		notify('Count editions for second data source', 4,
				count($data_source->edition_ids));

		$editions = $LOOKUP_FACTORY->getEditions();
		notify('Get editions', 10, count($editions));
		$edition = $editions[1];
		notify('Check edition code', 'asce_41-2013', $edition->code);
		notify('Count design code variants for asce-41-2013', 5,
				count($edition->design_code_variant_ids));
		$edition = $editions[2];
		notify('Check risk category label', 'Risk Category',
				$edition->risk_category_label);
		notify('Count risk categories for ibc-2012', 5,
				count($edition->risk_category_ids));
		notify('Count site soil classes for ibc-2012', 5,
				count($edition->site_soil_class_ids));
		$edition = $editions[0];
		notify('Count site soil classes for nehrp-2015', 6,
				count($edition->site_soil_class_ids));

		$design_code_variants = $LOOKUP_FACTORY->getDesignCodeVariants();
		notify('Get design code variants', 8, count($design_code_variants));
		notify('Get requires exceedence prob. for asce-41-2013/custom', 1,
				$design_code_variants[4]->requires_exceedence_probability);

		$risk_categories = $LOOKUP_FACTORY->getRiskCategories();
		notify('Get risk categories', 10, count($risk_categories));
		notify('Check category text for first risk category', 
				'I or II or III', $risk_categories[0]->category);

		$site_soil_classes = $LOOKUP_FACTORY->getSiteSoilClasses();
		notify('Get site soil classes', 6, count($site_soil_classes));
		notify('Check code for first site soil class', 'A', 
				$site_soil_classes[0]->code);
	} catch (Exception $e) {
		print $e->getMessage() . "\n";
	}
?>

