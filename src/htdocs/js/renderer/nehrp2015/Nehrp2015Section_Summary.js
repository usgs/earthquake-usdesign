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
    _smSpectrum = SpectraGraphView({
      el: document.createElement('div'),
      data: [],
      title: 'MCE<sub>R</sub> Spectrum',
      yAxisLabel: 'Sa (g)'
    });

    _sdSpectrum = SpectraGraphView({
      el: document.createElement('div'),
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
        s1,
        sd1,
        sds,
        sdsAside,
        section,
        siteClass,
        sm1,
        sms,
        smsAside,
        ss,
        supOne,
        supStar,
        sdSpectraWrapper,
        smSpectraWrapper;

    model = args.model;
    section = args.section;

    result = model.get('result');
    siteClass = result.get('site_class').get('value').slice(0, 1).toUpperCase();

    s1 = result.get('s1');
    sd1 = result.get('sd1');
    sds = result.get('sds');
    sm1 = result.get('sm1');
    sms = result.get('sms');
    ss = result.get('ss');

    supStar = '';
    supOne = '';

    if (siteClass === 'E' && _this.outputNumber(ss) >= 1.0) {
      supStar = '<sup>*</sup>';
    }

    if (siteClass === 'E' || siteClass === 'D' &&
        _this.outputNumber(s1) >= 0.2) {
      supOne = '<sup>1</sup>';
    }

    markup = [
      '<dl class="report-summary-values">',
        '<dt>S<sub>S</sub></dt>',
        '<dd class="report-summary-value-ss">',
          _this.outputNumber(ss),
        ' g</dd>',

        '<dt>S<sub>MS</sub></dt>',
        '<dd class="report-summary-value-sms">',
          _this.outputNumber(sms),
          ' g',
          supStar,
        '</dd>',

        '<dt>S<sub>DS</sub></dt>',
        '<dd class="report-summary-value-sds">',
          _this.outputNumber(sds),
          ' g',
          supStar,
        '</dd>',

        '<dt class="break">S<sub>1</sub></dt>',
        '<dd class="report-summary-value-s1">',
          _this.outputNumber(s1),
        ' g</dd>',

        '<dt>S<sub>M1</sub></dt>',
        '<dd class="report-summary-value-sm1">',
          _this.outputNumber(sm1),
          ' g',
          supOne,
        '</dd>',

        '<dt>S<sub>D1</sub></dt>',
        '<dd class="report-summary-value-sd1">',
          _this.outputNumber(sd1),
          ' g',
          supOne,
        '</dd>',
      '</dl>'
    ];

    if (supStar !== '') {
      markup.push('<aside>',
        '<sup>*</sup> Since the Site Class is ',
        siteClass,
        ' and SS ≥ 1.0 g, see the ',
        'requirements for site-specific ground motions in Section 11.4.7. ',
        'Here the exception allowing use of the F<sub>a</sub> values for ',
        'Site Class C has been invoked.',
      '</aside>');
    }

    if (supOne !== '') {
      markup.push('<aside>',
        '<sup>1</sup> Since the Site Class is ',
        siteClass,
        ' and S<sub>1</sub> ≥ 0.2 g, ',
        'site-specific ground motions might be required. See Section 11.4.7. ',
      '</aside>');
    }

    markup.push('<div class="report-summary-spectra row">',
      '<div class="report-summary-spectra-sm column one-of-two"></div>',
      '<div class="report-summary-spectra-sd column one-of-two"></div>',
    '</div>');

    section.innerHTML = markup.join('');

    smSpectraWrapper = section.querySelector('.report-summary-spectra-sm');
    sdSpectraWrapper = section.querySelector('.report-summary-spectra-sd');
    smSpectraWrapper.appendChild(_smSpectrum.el);
    sdSpectraWrapper.appendChild(_sdSpectrum.el);

    if (_this.outputNumber(sms) < _this.outputNumber(sm1)) {
      smsAside = document.createElement('smsAside');
      sdsAside = document.createElement('sdsAside');

      smsAside.innerHTML = '<aside>' +
          'Since S<sub>MS</sub> < S<sub>M1</sub>, for this ' +
          'response spectrum S<sub>MS</sub> has been set equal to ' +
          'S<sub>M1</sub> in accordance with Section 11.4.3.' +
          '</aside>';

      sdsAside.innerHTML = '<aside>' +
          'Since S<sub>MS</sub> < S<sub>M1</sub>, for this ' +
          'response spectrum S<sub>MS</sub> has been set equal to ' +
          'S<sub>M1</sub> (and hence S<sub>DS</sub> has been set equal ' +
          'to S<sub>D1</sub>),  in accordance with Section 11.4.3.' +
          '</aside>';

      smSpectraWrapper.appendChild(smsAside);
      sdSpectraWrapper.appendChild(sdsAside);
    }

    _smSpectrum.model.set({data: result.get('smSpectrum')||[]}, {silent: true});
    _sdSpectrum.model.set({data: result.get('sdSpectrum')||[]}, {silent: true});

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Summary;
