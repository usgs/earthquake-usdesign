'use strict';

var config = require('./config');

var CWD = process.cwd();

// List individual modules here. Each listed module will be aliased in the
// "bundle", and will be set as an external in the "test".
var EXPORTS = [
  CWD + '/' + config.src + '/htdocs/js/ExampleModule.js:ExampleModule'
];
// Subsequent source files can then require "ExampleModule" with:
// var ExampleModule = require('package/ExampleModule');

var browerify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src + '/htdocs/js'
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
