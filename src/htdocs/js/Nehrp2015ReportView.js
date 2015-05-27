'use strict';

var
  Calculation = require('Calculation'),
  SpectraGraphView = require('SpectraGraphView'),

  Formatter = require('util/Formatter'),
  SiteAmplification = require('util/SiteAmplification'),

  View = require('mvc/View')/*,

  Util = require('util/Util')*/;


var _FIGURE_22_1 = 'http://placehold.it/640x480',
    _FIGURE_22_2 = 'http://placehold.it/640x480',
    _FIGURE_22_3 = 'http://placehold.it/640x480',
    _FIGURE_22_4 = 'http://placehold.it/640x480',
    _FIGURE_22_5 = 'http://placehold.it/640x480',
    _FIGURE_22_6 = 'http://placehold.it/640x480';

var Nehrp2015ReportView = function (params) {
  var _this,
      _initialize,

      _eq11_4_1,
      _eq11_4_2,
      _eq11_4_3,
      _eq11_4_4,
      _eqSummaryS1,
      _eqSummarySs,
      _faSummary,
      _faTable,
      _fafvUnknownTable,
      _fvSummary,
      _fvTable,
      _siteAmplification,
      _summaryS1,
      _summarySs,
      _summarySd1,
      _summarySds,
      _summarySdSpectrum,
      _summarySm1,
      _summarySms,
      _summarySmSpectrum,

      _createViewSkeleton,
      _displayNumber,
      _updateEquation11_4_1,
      _updateEquation11_4_2,
      _updateEquation11_4_3,
      _updateEquation11_4_4,
      _updateEquationSummaryS1,
      _updateEquationSummarySs,
      _updateFaInfo,
      _updateFaFvUnknownTable,
      _updateFvInfo,
      _updateVisiblity;


  _this = View(params);

  _initialize = function (/*params*/) {
    _siteAmplification = SiteAmplification();

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

    el.classList.add('report-view');
    el.classList.add('nehrp-2015-report-view');

    el.innerHTML = [
      '<section class="summary-output">',
        '<dl class="report-summary-values">',
          '<dt>S<sub>S</sub></dt>',
          '<dd class="report-summary-value-ss"></dd>',

          '<dt>S<sub>MS</sub></dt>',
          '<dd class="report-summary-value-sms"></dd>',

          '<dt>S<sub>DS</sub></dt>',
          '<dd class="report-summary-value-sds"></dd>',

          '<dt class="break">S<sub>1</sub></dt>',
          '<dd class="report-summary-value-s1"></dd>',

          '<dt>S<sub>M1</sub></dt>',
          '<dd class="report-summary-value-sm1"></dd>',

          '<dt>S<sub>D1</sub></dt>',
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
      '</section>',

      '<section class="report-section section-11-4-1">',
        '<h3>',
          'Section 11.4.1 &mdash; Mapped Acceleration Parameters and ',
          'Risk Coefficients',
        '<h3>',
        '<h5>',
          '<a href="', _FIGURE_22_1, '">',
            'Figure 22-1: Uniform-Hazard (2% in 50-Year) Ground Motions of ',
            '0.2-Second Spectral Response Acceleration (5% of Critical ',
            'Damping), Site Class B',
          '</a>',
        '</h5>',
        '<h5>',
          '<a href="', _FIGURE_22_2, '">',
            'Figure 22-2: Uniform-Hazard (2% in 50-Year) Ground Motions of ',
            '1.0-Second Spectral Response Acceleration (5% of Critical ',
            'Damping), Site Class B',
          '</a>',
        '</h5>',

        '<h5>',
          '<a href="', _FIGURE_22_3, '">',
            'Figure 22-3: Risk Coefficient at 0.2-Second Spectral Reponse Period',
          '</a>',
        '</h5>',
        '<h5>',
          '<a href="', _FIGURE_22_4, '">',
            'Figure 22-4: Risk Coefficient at 1.0-Second Spectral Reponse Period',
          '</a>',
        '</h5>',

        '<h5>',
          '<a href="', _FIGURE_22_5, '">',
            'Figure 22-5: Deterministic Ground Motions of 0.2-Second Spectral ',
            'Response Acceleration (5% of Critical Damping), Site Class B',
          '</a>',
        '</h5>',
        '<h5>',
          '<a href="', _FIGURE_22_6, '">',
            'Figure 22-6: Deterministic Ground Motions of 1.0-Second Spectral ',
            'Response Acceleration (5% of Critical Damping), Site Class B',
          '</a>',
        '</h5>',
      '</section>',

      '<section class="report-section section-11-4-2">',
        '<h3>Section 11.4.2 &mdash; Site Class</h3>',
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
                'F. Soils requiring site reponse analysis in accordance with ',
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
        '</table>',
      '</section>',

      '<section class="report-section section-11-4-3">',
        '<h3>',
          'Section 11.4.3 &mdash; Site Coefficients, Risk Coefficients, and ',
          'Risk-Targeted Maximum Considered Earthquake (MCE<sub>R</sub>) ',
          'Spectral Response Acceleration Parameters',
        '</h3>',

        '<div class="equation">',
          '<label for="equation-11-4-1">Equation (11.4-1)</label>',
          '<span id="equation-11-4-1"></span>',
        '</div>',
        '<div class="equation">',
          '<label for="equation-11-4-2">Equation (11.4-2)</label>',
          '<span id="equation-11-4-2"></span>',
        '</div>',
        '<div class="equation equation-summary">',
          'S<sub>S</sub> &equiv; &ldquo;Less of values from Equations ',
          '(11.4-1) and (11.4-2)&rdquo; = <span class="eq-summary-ss"></span>',
        '</div>',

        '<div class="equation">',
          '<label for="equation-11-4-3">Equation (11.4-3)</label>',
          '<span id="equation-11-4-3"></span>',
        '</div>',
        '<div class="equation">',
          '<label for="equation-11-4-4">Equation (11.4-3)</label>',
          '<span id="equation-11-4-4"></span>',
        '</div>',
        '<div class="equation equation-summary">',
          'S<sub>1</sub> &equiv; &ldquo;Less of values from Equations ',
          '(11.4-3) and (11.4-4)&rdquo; = <span class="eq-summary-s1"></span>',
        '</div>',

        '<h4>Table 11.4-1: Site Coefficient F<sub>a</sub></h4>',
        '<div class="report-table-fa"></div>',
        '<p class="report-summary-fa"></p>',

        '<h4>Table 11.4-2: Site Coefficient F<sub>v</sub></h4>',
        '<div class="report-table-fv"></div>',
        '<p class="report-summary-fv"></p>',

        '<h4>',
          'Table 11.4-3: Site Coefficients for Undetermined Soil Sites ',
          '(excluding Eor F), F<sub>a</sub> and F<sub>v</sub>',
        '</h4>',
        '<div class="report-table-undetermined-fafv"></div>',
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

    _eq11_4_1 = el.querySelector('#equation-11-4-1');
    _eq11_4_2 = el.querySelector('#equation-11-4-2');
    _eqSummarySs = el.querySelector('.eq-summary-ss');

    _eq11_4_3 = el.querySelector('#equation-11-4-3');
    _eq11_4_4 = el.querySelector('#equation-11-4-4');
    _eqSummaryS1 = el.querySelector('.eq-summary-s1');

    _faTable = el.querySelector('.report-table-fa');
    _faSummary = el.querySelector('.report-summary-fa');

    _fvTable = el.querySelector('.report-table-fv');
    _fvSummary = el.querySelector('.report-summary-fv');

    _fafvUnknownTable = el.querySelector('.report-table-undetermined-fafv');
  };

  _displayNumber = function (number) {
    return Formatter.number(Formatter.value(number), 3);
  };

  _updateEquation11_4_1 = function (result) {
    var crs,
        ssuh,
        value;

    crs = result.get('crs');
    ssuh = result.get('ssuh');
    value = crs * ssuh;

    _eq11_4_1.innerHTML = [
      'C<sub>RS</sub>S<sub>SUH</sub> = ',
        _displayNumber(crs), ' &times; ',
        _displayNumber(ssuh), ' = ',
        _displayNumber(value), ' g'
    ].join('');
  };

  _updateEquation11_4_2 = function (result) {
    var ssd;

    ssd = result.get('ssd');

    _eq11_4_2.innerHTML = [
      'S<sub>SD</sub> = ',
        _displayNumber(ssd), ' g'
    ].join('');
  };

  _updateEquation11_4_3 = function (result) {
    var cr1,
        s1uh,
        value;

    cr1 = result.get('crs');
    s1uh = result.get('ssuh');
    value = cr1 * s1uh;

    _eq11_4_3.innerHTML = [
      'C<sub>R1</sub>S<sub>1UH</sub> = ',
        _displayNumber(cr1), ' &times; ',
        _displayNumber(s1uh), ' = ',
        _displayNumber(value), ' g'
    ].join('');
  };

  _updateEquation11_4_4 = function (result) {
    var s1d;

    s1d = result.get('s1d');

    _eq11_4_4.innerHTML = [
      'S<sub>1D</sub> = ',
        _displayNumber(s1d), ' g'
    ].join('');
  };

  _updateEquationSummaryS1 = function (result) {
    _eqSummaryS1.innerHTML = _displayNumber(result.get('s1')) + ' g';
  };

  _updateEquationSummarySs = function (result) {
    _eqSummarySs.innerHTML = _displayNumber(result.get('ss')) + ' g';
  };

  _updateFaInfo = function (result) {
    var fa,
        ss,
        siteClass;

    fa = result.get('fa');
    ss = result.get('ss');
    siteClass = result.get('site_class').get('value');

    _faTable.innerHTML = '';
    _faTable.appendChild(_siteAmplification.getFaTable(ss, siteClass));
    _faSummary.innerHTML = [
      'For Site Class = ', siteClass, ' and S<sub>S</sub> = ',
      _displayNumber(ss), ' g, F<sub>a</sub> = ', _displayNumber(fa)
    ].join('');
  };

  _updateFaFvUnknownTable = function (result) {
    var s1,
        ss,
        siteClass;

    ss = result.get('ss');
    s1 = result.get('s1');
    siteClass = result.get('site_class').get('value');

    _fafvUnknownTable.innerHTML = '';
    _fafvUnknownTable.appendChild(
        _siteAmplification.getUndeterminedSsS1Table(ss, s1, siteClass));
  };

  _updateFvInfo = function (result) {
    var fv,
        s1,
        siteClass;

    fv = result.get('fv');
    s1 = result.get('s1');
    siteClass = result.get('site_class').get('value');

    _fvTable.innerHTML = '';
    _fvTable.appendChild(_siteAmplification.getFvTable(s1, siteClass));
    _fvSummary.innerHTML = [
      'For Site Class = ', siteClass, ' and S<sub>1</sub> = ',
      _displayNumber(s1), ' g, F<sub>v</sub> = ', _displayNumber(fv)
    ].join('');
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

    _eq11_4_1 = null;
    _eq11_4_2 = null;
    _eq11_4_3 = null;
    _eq11_4_4 = null;
    _eqSummaryS1 = null;
    _eqSummarySs = null;
    _faSummary = null;
    _faTable = null;
    _fafvUnknownTable = null;
    _fvSummary = null;
    _fvTable = null;
    _summaryS1 = null;
    _summarySs = null;
    _summarySd1 = null;
    _summarySds = null;
    _summarySdSpectrum = null;
    _summarySm1 = null;
    _summarySms = null;
    _summarySmSpectrum = null;


    _createViewSkeleton = null;
    _displayNumber = null;
    _updateEquation11_4_1 = null;
    _updateEquation11_4_2 = null;
    _updateEquation11_4_3 = null;
    _updateEquation11_4_4 = null;
    _updateEquationSummaryS1 = null;
    _updateEquationSummarySs = null;
    _updateFaInfo = null;
    _updateFaFvUnknownTable = null;
    _updateFvInfo = null;
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

    _updateEquation11_4_1(result);
    _updateEquation11_4_2(result);
    _updateEquationSummarySs(result);

    _updateEquation11_4_3(result);
    _updateEquation11_4_4(result);
    _updateEquationSummaryS1(result);

    _updateFaInfo(result);
    _updateFvInfo(result);
    _updateFaFvUnknownTable(result);
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015ReportView;
