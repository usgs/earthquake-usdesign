'use strict';

var Section = require('renderer/Section'),

    Util = require('util/Util');


var _DEFAULTS = {
  classes: ['section-11-4-4'],
  nodeType: 'section'
};

var Nehrp2015Section_Section_11_4_4 = function (params) {
  var _this,
      _initialize;


  _this = Section(Util.extend({}, _DEFAULTS, params));

  _initialize = function (/*params*/) {
  };


  _this.getSection = Util.compose(_this.getSection, function (args) {
    var model,
        result,
        sd1,
        sds,
        section,
        sm1,
        sms;

    model = args.model;
    section = args.section;

    result = model.get('result');

    sms = result.get('sms');
    sm1 = result.get('sm1');

    sds = result.get('sds');
    sd1 = result.get('sd1');

    section.innerHTML = [
      '<h3>',
        'Design Spectral Acceleration Parameters',
      '</h3>',

      '<div class="equation">',
        '<label for="equation-11-4-7">Design Ground Motion</label>',
        '<span id="equation-11-4-7">',
          'S<sub>DS</sub> = &#8532; S<sub>MS</sub> = &#8532; &times; ',
          _this.outputNumber(sms), ' = ', _this.outputNumber(sds), ' g',
        '<span>',
      '</div>',
      '<div class="equation">',
        '<label for="equation-11-4-8">Design Ground Motion</label>',
        '<span id="equation-11-4-8">',
          'S<sub>D1</sub> = &#8532; S<sub>M1</sub> = &#8532; &times; ',
          _this.outputNumber(sm1), ' = ', _this.outputNumber(sd1), ' g',
        '<span>',
      '</div>',

      '<aside>',
        'Note: S<sub>DS</sub> shall not be taken less than S<sub>D1</sub> ',
        'except when determining Seismic Design Category.',
      '</aside>'
    ].join('');

    return args;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Nehrp2015Section_Section_11_4_4;
