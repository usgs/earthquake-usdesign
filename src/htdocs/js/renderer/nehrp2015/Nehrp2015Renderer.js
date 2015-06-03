'use strict';

var NEHRPCalc2015 = require('NEHRPCalc2015'),

    LookupDataFactory = require('util/LookupDataFactory'),

    Nehrp2015Section_Summary =
        require('renderer/nehrp2015/Nehrp2015Section_Summary'),
    Nehrp2015Section_11_4_1 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_1'),
    Nehrp2015Section_11_4_2 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_2'),
    Nehrp2015Section_11_4_3 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_3'),
    Nehrp2015Section_11_4_4 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_4'),
    Nehrp2015Section_11_4_5 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_5'),
    Nehrp2015Section_11_4_6 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_6'),
    Nehrp2015Section_11_8_3 =
        require('renderer/nehrp2015/Nehrp2015Section_11_8_3');


var Nehrp2015Renderer = function (params) {
  var _this,
      _initialize,

      _calculator,
      _factory,
      _sections;


  _this = {};

  _initialize = function (params) {
    params = params || {};

    _factory = params.lookupDataFactory || LookupDataFactory();
    _calculator = NEHRPCalc2015({
      lookupDataFactory: _factory
    });

    _sections = params.sections || [
      Nehrp2015Section_Summary({
        calculator: _calculator,
        lookupDataFactory: _factory}
      ),
      Nehrp2015Section_11_4_1({
        calculator: _calculator,
        lookupDataFactory: _factory}
      ),
      Nehrp2015Section_11_4_2({
        calculator: _calculator,
        lookupDataFactory: _factory}
      ),
      Nehrp2015Section_11_4_3({
        calculator: _calculator,
        lookupDataFactory: _factory}
      ),
      Nehrp2015Section_11_4_4({
        calculator: _calculator,
        lookupDataFactory: _factory}
      ),
      Nehrp2015Section_11_4_5({
        calculator: _calculator,
        lookupDataFactory: _factory}
      ),
      Nehrp2015Section_11_4_6({
        calculator: _calculator,
        lookupDataFactory: _factory}
      ),
      Nehrp2015Section_11_8_3({
        calculator: _calculator,
        lookupDataFactory: _factory
    })
    ];

  };


  _this.contentInDom = function () {
    _sections.forEach(function (section) {
      section.contentInDom();
    });
  };

  _this.getReport = function (model) {
    var content,
        fragment;

    fragment = document.createDocumentFragment();
    _calculator.calculate(model);

    _sections.forEach(function (section) {
      content = section.getSection({section: null, model: model});

      if (content.section) {
        fragment.appendChild(content.section);
      }
    });

    return fragment;
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = Nehrp2015Renderer;
