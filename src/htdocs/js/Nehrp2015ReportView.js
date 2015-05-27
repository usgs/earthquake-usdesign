'use strict';

var
  Calculation = require('Calculation'),
  SpectraGraphView = require('SpectraGraphView'),

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
