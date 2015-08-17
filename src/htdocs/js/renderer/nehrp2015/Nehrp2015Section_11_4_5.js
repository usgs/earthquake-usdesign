'use strict';

var Section = require('renderer/Section'),

    SpectraGraphView = require('SpectraGraphView'),

    Util = require('util/Util');


var _DEFAULTS = {
  classes: ['section-11-4-5'],
  nodeType: 'section'
};

var Nehrp2015Section_Section_11_4_5 = function (params) {
  var _this,
      _initialize,

      _spectrum;


  params = Util.extend({}, _DEFAULTS, params);
  _this = Section(params);

  _initialize = function () {
    var spectrumEl;

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

  _this.contentInDom = function () {
    _spectrum.render();
  };

  _this.getSection = Util.compose(_this.getSection, function (args) {
    var model,
        region,
        result,
        section,
        tSubL;

    model = args.model;
    section = args.section;

    result = model.get('result');
    region = model.get('output').get('metadata').get('region_id');
    tSubL = model.get('output').get('tl');

    if (tSubL === null) {
      tSubL = '&ndash;';
    } else {
      tSubL += ' s';
    }

    section.innerHTML = [
      '<h3>Design Response Spectrum</h3>',
      '<div class="equation">',
        '<span id="tl">',
          'Long-Period Transition Period = T<sub>L</sub> = ',
          tSubL,
        '</span>',
      '</div>',
      '<h4>',
        'Figure 11.4-1: Design Response Spectrum',
      '</h4>'
    ].join('');

    section.appendChild(_spectrum.el);

    _spectrum.model.set({
      data: result.get('sdSpectrum') || [],
      ss: result.get('sds'),
      s1: result.get('sd1')
    }, {silent: true});

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Section_11_4_5;
