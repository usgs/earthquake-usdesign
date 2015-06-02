'use strict';

var concurrent = {
  dev: [
    'browserify:index',
    'browserify:leaflet',
    'copy:dev',
    'copy:leaflet',
    'copy:locationView',
    'compass:dev'
  ],

  dist: [
    'copy:dist',
    'uglify',
    'cssmin'
  ],

  test: [
    'browserify:test',
    'browserify:bundle',
    'copy:test'
  ]
};

module.exports = concurrent;
