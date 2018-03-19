<?php
if (!isset($TEMPLATE)) {
  // Page title. Shows up as <title> in <head> and an <h1> in content.
  $TITLE = 'U.S. Seismic Design Maps';

  // Cooperator Logo
    $COOPERATORS = '<a class="cooperator" href="https://www.fema.gov/">
        <img src="images/FEMA_logo.svg"
        alt="in cooperation with Federal Emergency Management Agency (FEMA)"/>
        </a>';

  // True, flase, or actual navigation markup
  $NAVIGATION = true;

  // Additional tags to add to <head> section. Typically stylesheets.
  $HEAD = '
    <link rel="stylesheet" href="css/index.css"/>
  ';

  // Additional tags to add to bottom of body section. Typically javascripts.
  $FOOT = '
    <script src="lib/leaflet/leaflet.js"></script>
    <script src="js/index.js"></script>
  ';

  include_once 'template.inc.php';
}
?>

<p class="alert info">
  Due to insufficient resources and the recent development of similar web tools
  by third parties, this spring the USGS will be streamlining the two U.S.
  Seismic Design Maps web applications, including the one below. Whereas the
  current applications each interact with users through a graphical user
  interface (GUI), the new web services will receive the inputs (e.g. latitude
  and longitude) in the form of a web address and return the outputs (e.g.
  S<sub>DS</sub> and S<sub>D1</sub>) in text form, without supplementary
  graphics. Though designed primarily to be read by the aforementioned
  third-party web GUIs, the text outputs are also human-readable. To preview
  the new web services, <a href="/ws/designmaps/">please click here</a>.
  Step-by-step instructions for using one of these web services,
  namely that for the recently published 2016 ASCE 7 Standard, <a
  href="./step-by-step-instructions-for-webservice_v3.pdf">are posted here</a>.
</p>

<div class="application"></div>
