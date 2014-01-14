<?php

	if (count($argv) < 1) {
		print "Usage: php DataFactory.test.php\n";
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

		$tsubl_value = $DATA_FACTORY->getTsublValueForPoint(-103.0,-40.5);
		notify('Get undefined tsubl value', -1, $tsubl_value->value);
		$tsubl_value = $DATA_FACTORY->getTsublValueForPoint(-103.0,40.5);
		notify('Get defined tsubl value', 4, $tsubl_value->value);

		// TODO: Dataset and data tests when these tables are populated.

//		print json_encode($tsubl_value) . "\n";
	} catch (Exception $e) {
		print $e->getMessage() . "\n";
	}
?>

