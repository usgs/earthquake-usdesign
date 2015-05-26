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
?>

<div id="input-view"></div>
