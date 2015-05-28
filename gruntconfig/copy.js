'use strict';

var config = require('./config');

var copy = {
  dev: {
    cwd: config.src,
    dest: config.build + '/' + config.src,
    expand: true,
    src: [
      '**/*',
      '!**/*.scss',
      '!**/*.js'
    ],
    filter: 'isFile',
    options: {
      mode: true
    }
  },

  dist: {
    cwd: config.build + '/' + config.src,
    dest: config.dist,
    expand: true,
    src: [
      'conf/config.inc.php',
      'conf/config.ini',

      'htdocs/css/images/**/*',
      'htdocs/images/**/*',
      'htdocs/*.html',
      'htdocs/*.php',

      'lib/**/*'
    ],
    filter: 'isFile',
    options: {
      mode: true
    }
  },

  test: {
    cwd: config.test,
    dest: config.build + '/' + config.test,
    expand: true,
    src: [
      'test.html'
    ]
  },

  leaflet: {
    expand: true,
    cwd: 'node_modules/leaflet/dist',
    dest: config.build + '/' + config.src + '/htdocs/lib/leaflet',
    src: [
      'leaflet.css',
      'images/**'
    ]
  },

  locationView: {
    expand: true,
    cwd: 'node_modules/hazdev-location-view/src/locationview',
    src: ['images/*'],
    dest: config.build + '/' + config.src + '/htdocs/css'
  },
};

module.exports = copy;
