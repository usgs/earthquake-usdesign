'use strict';

var config = require('./config');

var compass = {
  dev: {
    options: {
      sassDir: config.src,
      cssDir: config.build + '/' + config.src,
      environment: 'development',
      importPath: [
        'node_modules/hazdev-accordion/src',
        'node_modules/hazdev-location-view/src'
      ]
    }
  }
};

module.exports = compass;
