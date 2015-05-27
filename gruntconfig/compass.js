'use strict';

var config = require('./config');

var compass = {
  dev: {
    options: {
      sassDir: config.src,
      cssDir: config.build + '/' + config.src,
      environment: 'development',
      importPath: [
        'node_modules/hazdev-accordion/src'
      ]
    }
  }
};

module.exports = compass;
