'use strict';

var Section = require('renderer/Section'),

    Formatter = require('util/Formatter'),

    Util = require('util/Util');


var _DEFAULTS = {
  classes: ['section-11-4-1'],
  nodeType: 'section',
  baseUrl: 'http://earthquake.usgs.gov/hazards/designmaps/downloads/pdfs',

  figures: {
    // Alaska
    1: {
      '22-1': '2009_NEHRP_Figure_22-1-page2.pdf',
      '22-2': '2009_NEHRP_Figure_22-2-page2.pdf',
      '22-3': '2009_NEHRP_Figure_22-3-page2.pdf',
      '22-4': '2009_NEHRP_Figure_22-4-page2.pdf',
      '22-5': '2009_NEHRP_Figure_22-5-page2.pdf',
      '22-6': '2009_NEHRP_Figure_22-6-page2.pdf'
    }
  }
};


var Nehrp2015Section_Section_11_4_1 = function (params) {
  var _this,
      _initialize,

      _baseUrl,
      _figures,

      _getFigure;


  params = Util.extend({}, _DEFAULTS, params);
  _this = Section(params);

  _initialize = function (params) {
    _baseUrl = params.baseUrl;
    _figures = params.figures;
  };


  _getFigure = function (region, figure) {
    var figures;

    figures = _figures[region];

    if (figures && figures.hasOwnProperty(figure)) {
      return _baseUrl + '/' + figures[figure];
    } else {
      return '#';
    }
  };


  _this.getSection = Util.compose(_this.getSection, function (args) {
    var metadata,
        output,
        region,
        section;

    output = args.model.get('output');
    section = args.section;

    metadata = output.get('metadata');
    region = output.get('region');

    section.innerHTML = [
      '<h3>',
        'Section 11.4.1 &mdash; Mapped Acceleration Parameters and ',
        'Risk Coefficients',
      '</h3>',
      '<p>',
        'Note: Ground motion values contoured on Figures 22-1, 2, 5 &amp; 6 ',
        'below are for the direction of maximmum considered spectral ',
        'response acceleration. They have been converted from corresponding ',
        'geometric mean ground motions computed by the USGS by ',
        'applying factors of ',
          Formatter.number(metadata.get('max_direction_ss'), 1),
        ' (to obtain S<sub>SUH</sub> and S<sub>SD</sub>) and ',
          Formatter.number(metadata.get('max_direction_s1'), 1),
        ' (to obtain S<sub>1UH</sub> and S<sub>1D</sub>). Maps in the ',
        'proposed 2015 NEHRP Provisions are provided for Site Class B. ',
        'Adjustments for other Site Classes are made, ad needed, in Section ',
        '11.4.3.',
      '</p>',
      '<h5>',
        '<a href="', _getFigure(region, '22-1'), '">',
          'Figure 22-1: Uniform-Hazard (2% in 50-Year) Ground Motions of ',
          '0.2-Second Spectral Response Acceleration (5% of Critical ',
          'Damping), Site Class B',
        '</a>',
      '</h5>',
      '<h5>',
        '<a href="', _getFigure(region, '22-2'), '">',
          'Figure 22-2: Uniform-Hazard (2% in 50-Year) Ground Motions of ',
          '1.0-Second Spectral Response Acceleration (5% of Critical ',
          'Damping), Site Class B',
        '</a>',
      '</h5>',

      '<h5>',
        '<a href="', _getFigure(region, '22-3'), '">',
          'Figure 22-3: Risk Coefficient at 0.2-Second Spectral Response ',
          'Period',
        '</a>',
      '</h5>',
      '<h5>',
        '<a href="', _getFigure(region, '22-4'), '">',
          'Figure 22-4: Risk Coefficient at 1.0-Second Spectral Response ',
          'Period',
        '</a>',
      '</h5>',

      '<h5>',
        '<a href="', _getFigure(region, '22-5'), '">',
          'Figure 22-5: Deterministic Ground Motions of 0.2-Second Spectral ',
          'Response Acceleration (5% of Critical Damping), Site Class B',
        '</a>',
      '</h5>',
      '<h5>',
        '<a href="', _getFigure(region, '22-6'), '">',
          'Figure 22-6: Deterministic Ground Motions of 1.0-Second Spectral ',
          'Response Acceleration (5% of Critical Damping), Site Class B',
        '</a>',
      '</h5>'
    ].join('');

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Section_11_4_1;
