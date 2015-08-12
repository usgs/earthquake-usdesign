'use strict';

var Section = require('renderer/Section'),

    SiteAmplification = require('util/SiteAmplification'),

    Util = require('util/Util');


var _DEFAULTS = {
  classes: ['section-11-8-3'],
  nodeType: 'section'
};

var Nehrp2015Section_Section_11_8_3 = function (params) {
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
    var fpga,
        fpgaTable,
        model,
        pga,
        pgam,
        result,
        section,
        siteClass,
        undetermined;

    try {
      model = args.model;
      section = args.section;

      result = model.get('result');

      pga = result.get('pga');
      fpga = result.get('fpga');
      siteClass = result.get('site_class').get('value');
      pgam = result.get('pgam');

      fpgaTable = document.createElement('div');
      fpgaTable.appendChild(_siteAmplification.getFpgaTable(pga, siteClass));

      undetermined = document.createElement('div');
      undetermined.appendChild(_siteAmplification.getUndeterminedPgaTable(
          pga, siteClass));

      section.innerHTML = [
        '<h3>',
          'Additional Geotechnical Investigation Report Requirements for ',
          'Seismic Design Categories D through F',
        '</h3>',

        '<h4>Table 11.8-1: Site Coefficient for F<sub>PGA</sub></h4>',
        '<div class="report-table-fpga">', fpgaTable.innerHTML, '</div>',
        '<p class="report-summary-fpga">',
          'For Site Class = ', siteClass, ' and PGA = ',
          _this.outputNumber(pga), ' g, F<sub>PGA</sub> = ',
          _this.outputNumber(fpga),
        '</p>',

        '<h4>',
          'Table 11.8-2 Site Coefficients for Undetermined Soil Sites ',
          '(excluding Class E or F), F<sub>PGA</sub>',
        '</h4>',
        '<div class="report-table-undetermined-pga">',
          undetermined.innerHTML,
        '</div>',

         '<div class="equation">',
          '<label for="equation-mapped-pga">Mapped PGA</label>',
          '<span id="equation-mapped-pga">',
            'PGA = ', _this.outputNumber(pga), ' g',
          '</span>',
        '</div>',

        '<div class="equation">',
          '<label for="equation-11-8-1">Equation (11.8-1)</label>',
          '<span id="equation-11-8-1">',
            'PGA<sub>M</sub> = F<sub>PGA</sub>PGA = ',
            _this.outputNumber(fpga), ' &times; ', _this.outputNumber(pga),
            ' = ', _this.outputNumber(pgam), ' g',
          '</span>',
        '</div>'
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

module.exports = Nehrp2015Section_Section_11_8_3;
