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
		$edition = $editions["2"];
		notify('Check edition code', 'asce_41-2013', $edition->code);
		notify('Count design code variants for asce-41-2013', 5,
				count($edition->design_code_variant_ids));
		notify('Count regions for asce_41-2013', 6,
				count($edition->region_ids));
		$edition = $editions["3"];
		notify('Check risk category label for ibc-2012', 'Risk Category',
				$edition->risk_category_label);
		notify('Count risk categories for ibc-2012', 2,
				count($edition->risk_category_ids));
		notify('Count site soil classes for ibc-2012', 5,
				count($edition->site_soil_class_ids));
		$edition = $editions["1"];
		notify('Count site soil classes for nehrp-2015', 6,
				count($edition->site_soil_class_ids));
		$edition = $editions["4"];
		notify('Count regions for aashto-2009', 4,
				count($edition->region_ids));
	
		$design_code_variants = $LOOKUP_FACTORY->getDesignCodeVariants();
		notify('Get design code variants', 8, count($design_code_variants));
		notify('Get requires exceedence prob. for asce-41-2013/custom', 1,
				$design_code_variants["5"]->requires_exceedence_probability);

		$risk_categories = $LOOKUP_FACTORY->getRiskCategories();
		notify('Get risk categories', 10, count($risk_categories));
		notify('Check category text for first risk category', 
				'I or II or III', $risk_categories["1"]->category);

		$regions = $LOOKUP_FACTORY->getRegions();
		notify('Get regions', 10, count($regions));
		notify('Check name for first region', 'Alaska', 
				$regions["1"]->name);

		$site_soil_classes = $LOOKUP_FACTORY->getSiteSoilClasses();
		notify('Get site soil classes', 6, count($site_soil_classes));
		notify('Check code for first site soil class', 'A', 
				$site_soil_classes["1"]->code);

//		print json_encode($data_sources) . "\n";
//		print json_encode($editions) . "\n";
//		print json_encode($design_code_variants) . "\n";
//		print json_encode($risk_categories) . "\n";
//		print json_encode($site_soil_classes) . "\n";
	} catch (Exception $e) {
		print $e->getMessage() . "\n";
	}
?>

