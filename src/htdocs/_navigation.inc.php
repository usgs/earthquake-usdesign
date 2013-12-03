<?php
	include_once 'functions.inc.php';

	print 
		navItem('index.php', 'Web Application') .
		navItem('batch.php', 'Batch Mode') .
		navItem('api.php', 'Web Service API') .
		navItem('http://earthquake.usgs.gov/hazards/designmaps/usdesign.php',
				'Background Information') .
		navItem('changelog.php', 'Change Log');
