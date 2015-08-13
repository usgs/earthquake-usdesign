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

    try {
      model = args.model;
      section = args.section;

      result = model.get('result');

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

      siteClass = result.get('site_class').get('value');

      faTable = document.createElement('div');
      faTable.appendChild(_siteAmplification.getFaTable(ss, siteClass));

      fvTable = document.createElement('div');
      fvTable.appendChild(_siteAmplification.getFvTable(s1, siteClass));

      undetermined = document.createElement('div');
      undetermined.appendChild(_siteAmplification.getUndeterminedSsS1Table(
          ss, s1, siteClass));

      section.innerHTML = [
        '<h3>',
          'Site Coefficients and Risk-Targeted Maximum Considered Earthquake ',
          '(MCE<sub>R</sub>) Spectral Response Acceleration Parameters',
        '</h3>',

        '<div class="equation">',
          '<label for="equation-11-4-1">Risk-targeted Ground Motion</label>',
          '<span id="equation-11-4-1">',
            'C<sub>RS</sub>S<sub>SUH</sub> = ',
            _this.outputNumber(crs), ' &times; ',
            _this.outputNumber(ssuh), ' = ',
            _this.outputNumber(crs * ssuh), ' g',
          '</span>',
        '</div>',
        '<div class="equation">',
          '<label for="equation-11-4-2">Deterministic Ground Motion</label>',
          '<span id="equation-11-4-2">',
            'S<sub>SD</sub> = ',
            _this.outputNumber(ssd), ' g',
          '</span>',
        '</div>',
        '<div class="equation equation-summary">',
          'S<sub>S</sub> &equiv; &ldquo;Lesser of ',
          'C<sub>RS</sub>S<sub>SUH</sub> and S<sub>SD</sub>&rdquo; = ',
          _this.outputNumber(ss), ' g',
        '</div>',

        '<div class="equation">',
          '<label for="equation-11-4-3">Risk-targeted Ground Motion</label>',
          '<span id="equation-11-4-3">',
            'C<sub>R1</sub>S<sub>1UH</sub> = ',
            _this.outputNumber(cr1), ' &times; ',
            _this.outputNumber(s1uh), ' = ',
            _this.outputNumber(cr1 * s1uh), ' g',
          '</span>',
        '</div>',
        '<div class="equation">',
          '<label for="equation-11-4-4">Deterministic Ground Motion</label>',
          '<span id="equation-11-4-4">',
            'S<sub>1D</sub> = ',
            _this.outputNumber(s1d), ' g',
          '</span>',
        '</div>',
        '<div class="equation equation-summary">',
          'S<sub>1</sub> &equiv; &ldquo;Lesser of ',
          'C<sub>R1</sub>S<sub>1UH</sub> and S<sub>1D</sub>&rdquo; = ',
          _this.outputNumber(s1), ' g',
        '</div>',

        '<h4>Table 11.4-1: Site Coefficient F<sub>a</sub></h4>',
        '<div class="report-table-fa">', faTable.innerHTML, '</div>',
        '<aside>',
          'Note: Where Site Class B is selected, but site-specific velocity ',
          'measurements are not made, the values of F<sub>a</sub> shall ',
          'be taken as 1.0.',
        '</aside>',
        '<aside>',
          'Note: Where Site Class D is selected as the default site class per ',
          'Section 11.4.2, the values of F<sub>a</sub> shall not be less ',
          'than 1.2.',
        '</aside>',
        '<p class="report-summary-fa">',
          'For Site Class = ', siteClass, ' and S<sub>S</sub> = ',
          _this.outputNumber(ss), ' g, F<sub>a</sub> = ', _this.outputNumber(fa),
        '</p>',

        '<h4>Table 11.4-2: Site Coefficient F<sub>v</sub></h4>',
        '<div class="report-table-fv">', fvTable.innerHTML, '</div>',
        '<aside>',
          'Note: Where Site Class B is selected, but site-specific velocity ',
          'measurements are not made, the values of F<sub>v</sub> shall ',
          'be taken as 1.0.',
        '</aside>',
        '<p class="report-summary-fv">',
          'For Site Class = ', siteClass, ' and S<sub>1</sub> = ',
          _this.outputNumber(s1), ' g, F<sub>v</sub> = ', _this.outputNumber(fv),
        '</p>',

        '<div class="equation">',
          '<label for="equation-11-4-5">Site-adjusted MCE<sub>R</sub></label>',
          '<span id="equation-11-4-5">',
            'S<sub>MS</sub> = F<sub>a</sub>S<sub>S</sub> = ',
            _this.outputNumber(fa), ' &times; ', _this.outputNumber(ss), ' = ',
            _this.outputNumber(sms), ' g',
          '<span>',
        '</div>',
        '<div class="equation">',
          '<label for="equation-11-4-6">Site-adjusted MCE<sub>R</sub></label>',
          '<span id="equation-11-4-6">',
            'S<sub>M1</sub> = F<sub>v</sub>S<sub>1</sub> = ',
            _this.outputNumber(fv), ' &times; ', _this.outputNumber(s1), ' = ',
            _this.outputNumber(sm1), ' g',
          '<span>',
        '</div>',
        '<aside>',
          'Note: S<sub>MS</sub> shall not be taken less than S<sub>M1</sub> ',
          'except when determining Seismic Design Category.',
        '</aside>'
      ].join('');
    } catch (e) {
      console.log(e);
    }

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Section_11_4_3;
