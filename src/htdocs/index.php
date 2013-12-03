<?php
if (!isset($TEMPLATE)) {
	$TITLE = 'U.S. DesignMaps Web Application';

	ob_start();
	include_once '_navigation.inc.php';
	$NAVIGATION = ob_get_clean();

	$HEAD = '
		<link rel="stylesheet" href="css/index.css"/>
	';
	$FOOT = '
		<script data-main="js/index.js" src="requirejs/require.js"></script>
	';

	include_once 'template.inc.php';
}
