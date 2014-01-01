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

		// Get lookup data tree
		$data_sources = $LOOKUP_FACTORY->getDataSources();
		notify('Get data sources', 3, count($data_sources));
		$data_source = $data_sources[1];
		notify('Get editions for second data source', 4,
				count($data_source->editions));
		$edition = $data_source->editions[0];
		notify('Check edition code', 'asce_41-2013', $edition->code);
		notify('Get design code variants for asce-41-2013', 5,
				count($edition->design_code_variants));
		notify('Get requires exceedence prob. for asce-41-2013/custom', 1,
				$edition->design_code_variants[4]->
				requires_exceedence_probability);
		$edition = $data_source->editions[1];
		notify('Check number of site soil classes', 5,
				count($edition->site_soil_classes));
		$site_soil_class = $edition->site_soil_classes[0];
		notify('Check site soil class code', 'A', $site_soil_class->code);
		notify('Check risk category label', 'Risk Category',
				$edition->risk_category_label);
		// TODO CHECK RISK CATEGORIES
	} catch (Exception $e) {
		print $e->getMessage() . "\n";
	}
?>

