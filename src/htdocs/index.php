<?php
if (!isset($TEMPLATE)) {
  // Page title. Shows up as <title> in <head> and an <h1> in content.
  $TITLE = 'Page Title';

  // True, flase, or actual navigation markup
  $NAVIGATION = true;

  // Additional tags to add to <head> section. Typically stylesheets.
  $HEAD = '
    <link rel="stylesheet" href="css/index.css"/>
  ';

  // Additional tags to add to bottom of body section. Typically javascripts.
  $FOOT = '
    <script src="js/index.js"></script>
  ';

  include_once 'template.inc.php';
}

// TODO, create a wrapper for data.ws.php
try {
  include_once '../lib/classes/data.ws.php';
  echo '<h3>Data</h3><pre>' . $data . '</pre>';
} catch (Exception $e) {
  echo '<h3>Error</h3><pre>' . $e->getMessage() . '</pre>';
}

?>
