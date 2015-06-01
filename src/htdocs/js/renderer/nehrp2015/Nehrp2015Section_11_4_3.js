'use strict';

var Section = require('renderer/Section'),

    SiteAmplification = require('util/SiteAmplification'),

    Util = require('util/Util');


var _DEFAULTS = {
  classes: ['section-11-4-3'],
  nodeType: 'section'
};

var Nehrp2015Section_Section_11_4_3 = function (params) {
  var _this,
      _initialize,

      _siteAmplification;


  _this = Section(Util.extend({}, _DEFAULTS, params));

  _initialize = function (params) {
    params = params || {};

    _siteAmplification = params.siteAmplification;

    if (!_siteAmplification) {
      _siteAmplification = SiteAmplification();
    }
  };


  _this.getSection = Util.compose(_this.getSection, function (args) {
    var cr1,
        crs,
        fa,
        faTable,
        fv,
        fvTable,
        model,
        result,
        s1,
        s1d,
        s1uh,
        section,
        siteClass,
        sm1,
        sms,
        ss,
        ssd,
        ssuh,
        undetermined;

    model = args.model;
    section = args.section;

    result = model.get('result');

    siteClass =

    crs = result.get('crs');
    ssuh = result.get('ssuh');
    ssd = result.get('ssd');
    ss = result.get('ss');
    fa = result.get('fa');
    sms = result.get('sms');

    cr1 = result.get('cr1');
    s1uh = result.get('s1uh');
    s1d = result.get('s1d');
    s1 = result.get('s1');
    fv = result.get('fv');
    sm1 = result.get('sm1');

    siteClass = result.get('site_class');

    if (!siteClass) {
      return args;
    }

    siteClass = siteClass.get('value');

    faTable = document.createElement('div');
    faTable.appendChild(_siteAmplification.getFaTable(ss, siteClass));

    fvTable = document.createElement('div');
    fvTable.appendChild(_siteAmplification.getFvTable(s1, siteClass));

    undetermined = document.createElement('div');
    undetermined.appendChild(_siteAmplification.getUndeterminedSsS1Table(
        ss, s1, siteClass));

    section.innerHTML = [
      '<h3>',
        'Section 11.4.3 &mdash; Site Coefficients, Risk Coefficients, and ',
        'Risk-Targeted Maximum Considered Earthquake (MCE<sub>R</sub>) ',
        'Spectral Response Acceleration Parameters',
      '</h3>',

      '<div class="equation">',
        '<label for="equation-11-4-1">Equation (11.4-1)</label>',
        '<span id="equation-11-4-1">',
          'C<sub>RS</sub>S<sub>SUH</sub> = ',
          _this.outputNumber(crs), ' &times; ',
          _this.outputNumber(ssuh), ' = ',
          _this.outputNumber(crs * ssuh), ' g',
        '</span>',
      '</div>',
      '<div class="equation">',
        '<label for="equation-11-4-2">Equation (11.4-2)</label>',
        '<span id="equation-11-4-2">',
          'S<sub>SD</sub> = ',
          _this.outputNumber(ssd), ' g',
        '</span>',
      '</div>',
      '<div class="equation equation-summary">',
        'S<sub>S</sub> &equiv; &ldquo;Lesser of values from Equations ',
        '(11.4-1) and (11.4-2)&rdquo; = ',
        _this.outputNumber(ss), ' g',
      '</div>',

      '<div class="equation">',
        '<label for="equation-11-4-3">Equation (11.4-3)</label>',
        '<span id="equation-11-4-3">',
          'C<sub>RS</sub>S<sub>SUH</sub> = ',
          _this.outputNumber(cr1), ' &times; ',
          _this.outputNumber(s1uh), ' = ',
          _this.outputNumber(cr1 * s1uh), ' g',
        '</span>',
      '</div>',
      '<div class="equation">',
        '<label for="equation-11-4-4">Equation (11.4-4)</label>',
        '<span id="equation-11-4-4">',
          'S<sub>SD</sub> = ',
          _this.outputNumber(s1d), ' g',
        '</span>',
      '</div>',
      '<div class="equation equation-summary">',
        'S<sub>1</sub> &equiv; &ldquo;Lesser of values from Equations ',
        '(11.4-3) and (11.4-4)&rdquo; = ',
        _this.outputNumber(s1), ' g',
      '</div>',

      '<h4>Table 11.4-1: Site Coefficient F<sub>a</sub></h4>',
      '<div class="report-table-fa">', faTable.innerHTML, '</div>',
      '<p class="report-summary-fa">',
        'For Site Class = ', siteClass, ' and S<sub>S</sub> = ',
        _this.outputNumber(ss), ' g, F<sub>a</sub> = ', _this.outputNumber(fa),
      '</p>',

      '<h4>Table 11.4-2: Site Coefficient F<sub>v</sub></h4>',
      '<div class="report-table-fv">', fvTable.innerHTML, '</div>',
      '<p class="report-summary-fv">',
        'For Site Class = ', siteClass, ' and S<sub>1</sub> = ',
        _this.outputNumber(s1), ' g, F<sub>v</sub> = ', _this.outputNumber(fv),
      '</p>',

      '<h4>',
        'Table 11.4-3: Site Coefficients for Undetermined Soil Sites ',
        '(excluding E or F), F<sub>a</sub> and F<sub>v</sub>',
      '</h4>',
      '<div class="report-table-undetermined-fafv">',
        undetermined.innerHTML,
      '</div>',

      '<div class="equation">',
        '<label for="equation-11-4-5">Equation (11.4-5)</label>',
        '<span id="equation-11-4-5">',
          'S<sub>MS</sub> = F<sub>a</sub>S<sub>S</sub> = ',
          _this.outputNumber(fa), ' &times; ', _this.outputNumber(ss), ' = ',
          _this.outputNumber(sms), ' g',
        '<span>',
      '</div>',
      '<div class="equation">',
        '<label for="equation-11-4-6">Equation (11.4-6)</label>',
        '<span id="equation-11-4-6">',
          'S<sub>M1</sub> = F<sub>v</sub>S<sub>1</sub> = ',
          _this.outputNumber(fv), ' &times; ', _this.outputNumber(s1), ' = ',
          _this.outputNumber(sm1), ' g',
        '<span>',
      '</div>'
    ].join('');

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Section_11_4_3;
