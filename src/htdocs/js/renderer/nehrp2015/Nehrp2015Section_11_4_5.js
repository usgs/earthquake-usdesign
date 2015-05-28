'use strict';

var Section = require('renderer/Section'),

    SpectraGraphView = require('SpectraGraphView'),

    Util = require('util/Util');


var _DEFAULTS = {
  classes: ['section-11-4-5'],
  nodeType: 'section',
  baseUrl: 'http://earthquake.usgs.gov/hazards/designmaps/downloads/pdfs',

  figures: {
    // Alaska
    1: '2009_NEHRP_Figure_22-7-page2.pdf'
  }
};

var Nehrp2015Section_Section_11_4_5 = function (params) {
  var _this,
      _initialize,

      _baseUrl,
      _figures,
      _spectrum,

      _getFigure;


  params = Util.extend({}, _DEFAULTS, params);
  _this = Section(params);

  _initialize = function (params) {
    var spectrumEl;

    _baseUrl = params.baseUrl;
    _figures = params.figures;

    spectrumEl = document.createElement('div');
    spectrumEl.classList.add('report-details-spectra-sd');

    _spectrum = SpectraGraphView({
      el: spectrumEl,
      data: [],
      title: null,
      ssLabel: 'S<sub>DS</sub>',
      s1Label: 'S<sub>D1</sub>',
      comment:
        'T < T<sub>0</sub> : ' +
            'S<sub>a</sub> = S<sub>DS</sub> ( 0.4 + 0.6 T / T<sub>0</sub> )\n' +
        'T<sub>0</sub> ≤ T ≤ T<sub>S</sub> : ' +
            'S<sub>a</sub> = S<sub>DS</sub>\n' +
        'T<sub>S</sub> < T ≤ T<sub>L</sub> : ' +
            'S<sub>a</sub> = S<sub>D1</sub> / T\n' +
        'T > T<sub>L</sub> : ' +
            'S<sub>a</sub> = S<sub>D1</sub> T<sub>L</sub> / T<sup>2</sup>'
    });
  };


  _getFigure = function (region) {
    if (_figures && _figures.hasOwnProperty(region)) {
      return _baseUrl + '/' + _figures[region];
    } else {
      return '#';
    }
  };


  _this.contentInDom = function () {
    _spectrum.render();
  };

  _this.getSection = Util.compose(_this.getSection, function (args) {
    var model,
        region,
        result,
        section;

    model = args.model;
    section = args.section;

    result = model.get('result');
    region = model.get('output').get('region');

    section.innerHTML = [
      '<h3>Section 11.4.5 &mdash; Design Response Spectrum</h3>',

      '<h5>',
        '<a href="', _getFigure(region), '">',
          'Figure 22-7: Long-period Transition Period, T<sub>L</sub> (s)',
        '</a>',
      '</h5>',

      '<h4>',
        'Figure 11.4-1: Design Response Spectrum',
      '</h4>'
    ].join('');

    section.appendChild(_spectrum.el);

    _spectrum.model.set({
      data: result.get('sdSpectrum'),
      ss: result.get('sds'),
      s1: result.get('sd1'),
    });

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Section_11_4_5;
