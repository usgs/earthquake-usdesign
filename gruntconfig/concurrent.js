'use strict';

var concurrent = {
  dev: [
    'browserify:index',
    'copy:dev',
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
