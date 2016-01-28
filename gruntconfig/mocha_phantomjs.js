'use strict';

var config = require('./config');

var mocha_phantomjs = {
  all: {
    options: {
      config: {
        useColors: false
      },
      urls: [
        'http://localhost:' + config.testPort + '/test.html'
      ]
    }
  }
};

module.exports = mocha_phantomjs;
