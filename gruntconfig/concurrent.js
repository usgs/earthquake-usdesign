'use strict';

var concurrent = {
  dev: [
    'browserify:index',
    'browserify:leaflet',
    'copy:dev',
    'copy:leaflet',
    'copy:locationView',
    'compass:dev',
    'postcss:build'
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
