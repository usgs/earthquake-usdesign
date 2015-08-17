'use strict';

var Section = require('renderer/Section'),

    Util = require('util/Util');


var _DEFAULTS = {
  classes: ['section-11-4-2'],
  nodeType: 'section'
};

var Nehrp2015Section_Section_11_4_2 = function (params) {
  var _this,
      _initialize;


  _this = Section(Util.extend({}, _DEFAULTS, params));

  _initialize = function (/*params*/) {
  };


  _this.getSection = Util.compose(_this.getSection, function (args) {
    var model,
        result,
        section;

    model = args.model;
    section = args.section;

    result = model.get('result');

    section.innerHTML = [
      '<h3>Site Class</h3>',
      '<p>',
        'The authority having jurisdiction (not the USGS), site-specific ',
        'geotechnical data, and/or the default has classified the site ',
        'class as Site Class <span class="site-class-letter"></span>, ',
        'based on the site soil properties in accordance with Chapter 20.',
      '</p>',
      '<h4>',
        'Table 20.3-1 Site Classification',
      '</h4>',
      '<table class="report-site-class-reference">',
        '<thead>',
          '<tr>',
            '<th scope="row">Site Class</th>',
            '<th scope="row"><span class="overbar">v</span><sub>S</sub></th>',
            '<th scope="row">',
              '<span class="overbar">N</span>',
              ' or ',
              '<span class="overbar">N</span><sub>ch</sub>',
            '</th>',
            '<th scope="row"><span class="overbar">s</span><sub>u</sub></th>',
          '</tr>',
        '</thead>',
        '<tbody>',
          '<tr>',
            '<th scope="row">A. Hard Rock</th>',
            '<td>&gt;5,000 ft/s</td>',
            '<td>N/A</td>',
            '<td>N/A</td>',
          '</tr>',
          '<tr>',
            '<th scope="row">B. Rock</th>',
            '<td>2,500 to 5,000 ft/s</td>',
            '<td>N/A</td>',
            '<td>N/A</td>',
          '</tr>',
          '<tr>',
            '<th scope="row">C. Very dense soil and soft rock</th>',
            '<td>1,200 to 2,500 ft/s</td>',
            '<td>&gt;50</td>',
            '<td>&gt;2,000 psf</td>',
          '</tr>',
          '<tr>',
            '<th scope="row">D. Stiff Soil</th>',
            '<td>600 to 1,200 ft/s</td>',
            '<td>15 to 50</td>',
            '<td>1,000 to 2,000 psf</td>',
          '</tr>',
          '<tr>',
            '<th scope="row">E. Soft clay soil</th>',
            '<td>&lt;600 ft/s</td>',
            '<td>&lt;15</td>',
            '<td>&lt;1,000 psf</td>',
          '</tr>',
          '<tr class="site-class-e-subtext">',
            '<th scope="row">&nbsp;</th>',
            '<td colspan="3">',
              'Any profile with more than 10 ft of soil having the ',
              'characteristics:',
              '<ul>',
                '<li>Plasticity index PI &gt; 20</li>',
                '<li>Moisture content w &ge; 40%, and</li>',
                '<li>',
                  'Undrained shear strength <span class="overbar">s</span>',
                  '<sub>u</sub> &lt; 500 psf',
                '</li>',
              '</ul>',
            '</td>',
          '</tr>',
          '<tr>',
            '<th scope="row">',
              'F. Soils requiring site response analysis in accordance with ',
              'Section 21.1',
            '</th>',
            '<td colspan="3">See Section 20.3.1</td>',
          '</tr>',
        '</tbody>',
        '<tfoot>',
          '<tr>',
            '<td colspan="4">',
              'For SI: 1ft/s = 0.3048 m/s 1lb/ft<sup>2</sup> = 0.0479 ',
              'kN/m<sup>2</sup>',
            '</td>',
          '</tr>',
        '</tfoot>',
      '</table>'
    ].join('');

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Section_11_4_2;
