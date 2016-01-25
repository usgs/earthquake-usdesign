<?php

include_once '../conf/config.inc.php';

print navItem($MOUNT_PATH . '/index.php', 'U.S. Seismic Design Maps');
print navItem('https://github.com/usgs/earthquake-usdesign/wiki/US-Seismic-Design-Maps-Application-Documentation',
    'Documentation');
