<?php

	if (count($argv) < 1) {
		print "Usage: php TableFactory.test.php\n";
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
		$f_tables = $TABLE_FACTORY->getFTables();
		notify('Get "F" tables', 6, count($f_tables));
		$f_table = $f_tables[0];
		notify('Check that number of header values matches number of data ' .
				'row items', count($f_table->header_values),
				count($f_table->data_rows['A']));
		$last_value = -1;
		$increasing = true;
		foreach ($f_table->header_values as $value) {
			if ($value < $last_value) {
				$increasing = false;
				break;
			}
			$last_value = $value;
		}
		notify('Check that header values are increasing', $increasing, true);
				
		$risk_tables = $TABLE_FACTORY->getRiskTables();
		notify('Get risk tables', 11, count($risk_tables));
		$risk_table = $risk_tables[0];
		notify('Check table type for first risk table', 'SDS',
				$risk_table->table_type);
		$header_values = $risk_table->header_values;
		notify('Count header values for first risk table', 3,
				count($header_values));
		notify('Check first header value for first risk table', 'I or II',
				$header_values[0]);
		$data_rows = $risk_table->data_rows;
		notify('Count data rows for first risk table', 4,
				count($data_rows));
		$s_value = 'S_DS < 0.167g';
		$data_row = $data_rows[$s_value];
		notify('Count category values for first data row of first risk table',
				3, count($data_row));
		notify('Check first category value for first data row of first ' .
				'risk table', 'A', $data_row[0]);

//		print json_encode($f_table) . "\n";
//		print json_encode($risk_table) . "\n";
	} catch (Exception $e) {
		print $e->getMessage() . "\n";
	}
?>

