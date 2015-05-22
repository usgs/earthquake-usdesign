'use strict';

var config = require('./config');

var CWD = '.',
    JSDIR = CWD + '/' + config.src + '/htdocs/js';

// List individual modules here. Each listed module will be aliased in the
// "bundle", and will be set as an external in the "test".
var EXPORTS = [
  JSDIR + '/Calculation.js:Calculation',
  JSDIR + '/CalculationView.js:CalculationView',
  JSDIR + '/SpectraGraphView.js:SpectraGraphView',
  JSDIR + '/WebServiceAccessor.js:WebServiceAccessor',

  JSDIR + '/util/D3GraphView.js:util/D3GraphView',
  JSDIR + '/util/LookupDataFactory.js:util/LookupDataFactory',
  JSDIR + '/util/SiteAmplification.js:util/SiteAmplification',

  // Dependencies that need to be exported so stuff works in examples/tests
  CWD + '/node_modules/hazdev-webutils/src/mvc/Collection.js:mvc/Collection',
  CWD + '/node_modules/hazdev-webutils/src/util/Xhr.js:util/Xhr'
];
// Subsequent source files can then require "ExampleModule" with:
// var ExampleModule = require('package/ExampleModule');

var browerify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        JSDIR,
        CWD + '/node_modules/hazdev-webutils/src'
      ]
    }
  },


  // the bundle used by the index page
  index: {
    src: [config.src + '/htdocs/js/index.js'],
    dest: config.build + '/' + config.src + '/htdocs/js/index.js'
  },

  // the bundle used by tests
  bundle: {
    src: [],
    dest: config.build + '/' + config.src + '/htdocs/js/bundle.js',
    options: {
      alias: EXPORTS
    }
  },

  // the bundle of test suites
  test: {
    src: [config.test + '/js/test.js'],
    dest: config.build + '/' + config.test + '/js/test.js',
    options: {
      external: EXPORTS
    }
  }
};

module.exports = browerify;
