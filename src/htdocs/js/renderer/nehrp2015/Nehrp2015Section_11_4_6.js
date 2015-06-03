'use strict';

var SpectraGraphView = require('SpectraGraphView'),

    Section = require('renderer/Section'),

    Util = require('util/Util');


var _DEFAULTS = {
  classes: ['section-11-4-6'],
  nodeType: 'section'
};

var Nehrp2015Section_Section_11_4_6 = function (params) {
  var _this,
      _initialize,

      _spectrum;


  _this = Section(Util.extend({}, _DEFAULTS, params));

  _initialize = function (/*params*/) {
    var spectrumEl;

    spectrumEl = document.createElement('div');
    spectrumEl.classList.add('report-details-spectra-sm');

    _spectrum = SpectraGraphView({
      el: spectrumEl,
      data: [],
      ssLabel: 'S<sub>MS</sub>',
      s1Label: 'S<sub>M1</sub>'
    });
  };


  _this.contentInDom = function () {
    _spectrum.render();
  };

  _this.getSection = Util.compose(_this.getSection, function (args) {
    var model,
        result,
        section;

    model = args.model;
    section = args.section;

    result = model.get('result');

    section.innerHTML = [
      '<h3>Section 11.4.6 &mdash; MCE<sub>R</sub> Response Spectrum</h3>',
      '<aside>',
        'The MCE<sub>R</sub> response spectrum is determined by ',
        'multiplying the design response spectrum above by 1.5.',
      '</aside>'
    ].join('');

    section.appendChild(_spectrum.el);

    _spectrum.model.set({
      data: result.get('smSpectrum') || [],
      ss: result.get('sms'),
      s1: result.get('sm1')
    });

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Section_11_4_6;
