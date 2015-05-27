'use strict';

var
  Calculation = require('Calculation'),
  SpectraGraphView = require('SpectraGraphView'),

  View = require('mvc/View')/*,

  Util = require('util/Util')*/;


var Nehrp2015ReportView = function (params) {
  var _this,
      _initialize,

      _summaryS1,
      _summarySs,
      _summarySd1,
      _summarySds,
      _summarySdSpectrum,
      _summarySm1,
      _summarySms,
      _summarySmSpectrum,

      _createViewSkeleton,
      _updateVisiblity;


  _this = View(params);

  _initialize = function (/*params*/) {

    // Don't listen for all changes, just result changes
    _this.model.off('change', 'render', _this);
    _this.model.on('change:result', 'render', _this);
    _this.model.on('change:mode', _updateVisiblity);

    _createViewSkeleton();
    _this.render();
  };

  _createViewSkeleton = function () {
    var el;

    el = _this.el;

    el.classList.add('report-view nehrp-2015-report-view');

    el.innerHTML = [
      '<section class="summary-output">',
        '<dl class="report-summary-values">',
          '<dt>S<sub>S</sub> = </dt>',
          '<dd class="report-summary-value-ss"></dd>',

          '<dt>S<sub>MS</sub> = </dt>',
          '<dd class="report-summary-value-sms"></dd>',

          '<dt>S<sub>DS</sub> = </dt>',
          '<dd class="report-summary-value-sds"></dd>',

          '<dt class="break">S<sub>1</sub> = </dt>',
          '<dd class="report-summary-value-s1"></dd>',

          '<dt>S<sub>M1</sub> = </dt>',
          '<dd class="report-summary-value-sm1"></dd>',

          '<dt>S<sub>D1</sub> = </dt>',
          '<dd class="report-summary-value-sd1"></dd>',
        '</dl>',
        '<aside>',
          'See below for information on how the S<sub>S</sub> and ',
          'S<sub>1</sub> values above have been calculated from probabilistic ',
          '(risk-targeted) and deterministic ground motions in the direction ',
          'of maximum horizontal reponse.',
        '</aside>',
        '<div class="report-summary-spectra row">',
          '<div class="report-summary-spectra-sm column one-of-two"></div>',
          '<div class="report-summary-spectra-sd column one-of-two"></div>',
        '</div>',
      '</section>'
    ].join('');

    _summarySs = el.querySelector('.report-summary-value-ss');
    _summarySms = el.querySelector('.report-summary-value-sms');
    _summarySds = el.querySelector('.report-summary-value-sds');

    _summaryS1 = el.querySelector('.report-summary-value-s1');
    _summarySm1 = el.querySelector('.report-summary-value-sm1');
    _summarySd1 = el.querySelector('.report-summary-value-sd1');

    _summarySmSpectrum = SpectraGraphView({
      el: el.querySelector('.report-summary-spectra-sm'),
      data: [],
      title: 'MCE<sub>R</sub>'
    });

    _summarySdSpectrum = SpectraGraphView({
      el: el.querySelector('.report-summary-spectra-sd'),
      data: [],
      title: 'Design Response Spectrum'
    });
  };

  _updateVisiblity = function () {
    var mode;

    mode = _this.model.get('mode');

    if (mode === Calculation.MODE_OUTPUT) {
      _this.el.removeClass('hidden');
      _this.render();
    } else {
      _this.el.addClass('hidden');
    }
  };


  _this.destroy = function () {
    _this.model.off('change:result', 'render', _this);
    _this.model.off('change:mode', _updateVisiblity);


    _summarySdSpectrum.destroy();
    _summarySmSpectrum.destroy();


    _summaryS1 = null;
    _summarySs = null;
    _summarySd1 = null;
    _summarySds = null;
    _summarySdSpectrum = null;
    _summarySm1 = null;
    _summarySms = null;
    _summarySmSpectrum = null;


    _createViewSkeleton = null;
    _updateVisiblity = null;


    _initialize = null;
    _this = null;
  };

  _this.render = function () {
    var mode,
        result;

    mode = _this.model.get('mode');
    result = _this.model.get('result');

    if (mode !== Calculation.MODE_OUTPUT || !result) {
      return;
    }

    _summarySs.innerHTML = result.get('ss');
    _summarySms.innerHTML = result.get('sms');
    _summarySds.innerHTML = result.get('sds');

    _summaryS1.innerHTML = result.get('s1');
    _summarySm1.innerHTML = result.get('sm1');
    _summarySd1.innerHTML = result.get('sd1');


    _summarySmSpectrum.model.set({data: result.get('smSpectrum')});
    _summarySdSpectrum.model.set({data: result.get('sdSpectrum')});
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015ReportView;
