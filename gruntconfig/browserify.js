'use strict';

var config = require('./config');

var CWD = '.',
    JSDIR = CWD + '/' + config.src + '/htdocs/js';

// List individual modules here. Each listed module will be aliased in the
// "bundle", and will be set as an external in the "test".
var EXPORTS = [
  JSDIR + '/ActionsView.js:ActionsView',
  JSDIR + '/Calculation.js:Calculation',
  JSDIR + '/CalculationView.js:CalculationView',
  JSDIR + '/NEHRPCalc2015.js:NEHRPCalc2015',
  JSDIR + '/ReportView.js:ReportView',
  JSDIR + '/SpectraGraphView.js:SpectraGraphView',
  JSDIR + '/WebServiceAccessor.js:WebServiceAccessor',
  JSDIR + '/NEHRP2015InputView.js:NEHRP2015InputView',

  JSDIR + '/util/D3GraphView.js:util/D3GraphView',
  JSDIR + '/util/LookupDataFactory.js:util/LookupDataFactory',
  JSDIR + '/util/SiteAmplification.js:util/SiteAmplification',

  // Dependencies that need to be exported so stuff works in examples/tests
  CWD + '/node_modules/hazdev-webutils/src/mvc/Collection.js:mvc/Collection',
  CWD + '/node_modules/hazdev-webutils/src/mvc/Model.js:mvc/Model',
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
        CWD + '/node_modules/hazdev-webutils/src',
        CWD + '/node_modules/hazdev-accordion/src',
        CWD + '/node_modules/hazdev-location-view/src'
      ]
    }
  },


  // the bundle used by the index page
  index: {
    src: [config.src + '/htdocs/js/index.js'],
    dest: config.build + '/' + config.src + '/htdocs/js/index.js',
    options: {
      external: [
        CWD + '/node_modules/leaflet/dist/leaflet-src.js:leaflet'
      ]
    }
  },

  // the bundle used by tests
  bundle: {
    src: [],
    dest: config.build + '/' + config.src + '/htdocs/js/bundle.js',
    options: {
      alias: EXPORTS,
      external: [
        CWD + '/node_modules/leaflet/dist/leaflet-src.js:leaflet'
      ]
    }
  },

  // the bundle of test suites
  test: {
    src: [config.test + '/js/test.js'],
    dest: config.build + '/' + config.test + '/js/test.js',
    options: {
      external: EXPORTS.concat(CWD + '/node_modules/leaflet/dist/leaflet-src.js:leaflet'
      )
    }
  },

  // bundle leaflet externally
  leaflet: {
    src: [],
    dest: config.build + '/' + config.src + '/htdocs/lib/leaflet/leaflet.js',
    options: {
      alias: [
        CWD + '/node_modules/leaflet/dist/leaflet-src.js:leaflet'
      ]
    }
  },
};

module.exports = browerify;
