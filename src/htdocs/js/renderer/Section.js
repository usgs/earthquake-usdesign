'use strict';

var NEHRPCalc2015 = require('NEHRPCalc2015'),

    LookupDataFactory = require('util/LookupDataFactory'),

    Formatter = require('util/Formatter');


var Section = function (params) {
  var _this,
      _initialize,

      _classes,
      _nodeType;


  _this = {};

  _initialize = function (params) {
    params = params || {};

    _this.calculator = params.calculator || NEHRPCalc2015();
    _this.factor = params.lookupDataFactory || LookupDataFactory();

    _classes = params.classes || [];
    _nodeType = params.nodeType || 'section';
  };


  _this.contentInDom = function () {
    // An extension point only
  };

  _this.getSection = function (args) {
    args = args || {};

    if (!args.section) {
      args.section = document.createElement(_nodeType);
    }

    args.section.classList.add('report-section');
    _classes.forEach(function (className) {
      args.section.classList.add(className);
    });

    return args;
  };

  _this.outputNumber = function (number) {
    if (number === null || typeof number === 'undefined' || isNaN(number)) {
      return '&ndash;';
    }

    return Formatter.number(parseFloat(number), 3);
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = Section;
