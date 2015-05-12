'use strict';


var ExampleModule = function (params) {
  var _this,
      _initialize;


  _this = {};

  _initialize = function (/*params*/) {
    console.log('Initializing...');
  };


  _this.destroy = function () {
    _initialize = null;
    _this = null;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ExampleModule;
