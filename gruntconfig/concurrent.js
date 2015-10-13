'use strict';

var concurrent = {
  dev: [
    'browserify:index',
    'browserify:leaflet',
    'copy:dev',
    'copy:leaflet',
    'copy:locationView',
    'postcss:dev'
  ],

  dist: [
    'copy:dist',
    'uglify',
    'postcss:dist'
  ],

  test: [
    'browserify:test',
    'browserify:bundle',
    'copy:test'
  ]
};

module.exports = concurrent;
