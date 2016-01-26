'use strict';

var SpectraGraphView = require('SpectraGraphView'),

    Section = require('renderer/Section'),

    Util = require('util/Util');


var _DEFAULTS = {
  classes: ['section-summary'],
  nodeType: 'section'
};

var Nehrp2015Section_Summary = function (params) {
  var _this,
      _initialize,

      _sdSpectrum,
      _smSpectrum,

      _createSpectra;


  _this = Section(Util.extend({}, _DEFAULTS, params));

  _initialize = function (/*params*/) {
    _createSpectra();
  };


  _createSpectra = function () {
    var sdEl,
        smEl;

    smEl = document.createElement('div');
    smEl.classList.add('report-summary-spectra-sm');
    smEl.classList.add('column');
    smEl.classList.add('one-of-two');

    sdEl = document.createElement('div');
    sdEl.classList.add('report-summary-spectra-sd');
    sdEl.classList.add('column');
    sdEl.classList.add('one-of-two');

    _smSpectrum = SpectraGraphView({
      el: smEl,
      data: [],
      title: 'MCE<sub>R</sub> Spectrum',
      yAxisLabel: 'Sa (g)'
    });

    _sdSpectrum = SpectraGraphView({
      el: sdEl,
      data: [],
      title: 'Design Response Spectrum',
      yAxisLabel: 'Sa (g)'
    });
  };

  _this.contentInDom = function () {
      _smSpectrum.render();
      _sdSpectrum.render();
  };

  _this.getSection = Util.compose(_this.getSection, function (args) {
    var markup,
        model,
        result,
        section,
        siteClass,
        spectraDiv;

    model = args.model;
    section = args.section;

    result = model.get('result');
    siteClass = result.get('site_class').get('value').slice(0, 1).toUpperCase();

    markup = [
      '<dl class="report-summary-values">',
        '<dt>S<sub>S</sub></dt>',
        '<dd class="report-summary-value-ss">',
          _this.outputNumber(result.get('ss')),
        ' g</dd>',

        '<dt>S<sub>MS</sub></dt>',
        '<dd class="report-summary-value-sms">',
          _this.outputNumber(result.get('sms')),
        ' g</dd>',

        '<dt>S<sub>DS</sub></dt>',
        '<dd class="report-summary-value-sds">',
          _this.outputNumber(result.get('sds')),
        ' g</dd>',

        '<dt class="break">S<sub>1</sub></dt>',
        '<dd class="report-summary-value-s1">',
          _this.outputNumber(result.get('s1')),
        ' g</dd>',

        '<dt>S<sub>M1</sub></dt>',
        '<dd class="report-summary-value-sm1">',
          _this.outputNumber(result.get('sm1')),
        ' g</dd>',

        '<dt>S<sub>D1</sub></dt>',
        '<dd class="report-summary-value-sd1">',
          _this.outputNumber(result.get('sd1')),
        ' g</dd>',
      '</dl>'
    ];

    if (siteClass === 'D' || siteClass === 'E') {
      markup.push('<aside>',
        'Since Site Class ', siteClass, ' has been selected, see the ',
        'requirements for site-specific ground motions in Section 11.4.7.',
      '</aside>');
    }

    markup.push('<div class="report-summary-spectra row">',
      '<div class="report-summary-spectra-sm column one-of-two"></div>',
      '<div class="report-summary-spectra-sd column one-of-two"></div>',
    '</div>');

    section.innerHTML = markup.join('');

    spectraDiv = section.querySelector('.report-summary-spectra');
    spectraDiv.appendChild(_smSpectrum.el);
    spectraDiv.appendChild(_sdSpectrum.el);

    _smSpectrum.model.set({data: result.get('smSpectrum')||[]}, {silent: true});
    _sdSpectrum.model.set({data: result.get('sdSpectrum')||[]}, {silent: true});

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Summary;
