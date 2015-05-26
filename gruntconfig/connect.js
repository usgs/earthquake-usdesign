'use strict';

var config = require('./config');

var iniConfig = require('ini').parse(require('fs')
    .readFileSync(config.src + '/conf/config.ini', 'utf-8'));

var rewrites = [
  {
    from:'^' + iniConfig.MOUNT_PATH +
    '/service/?([^/]+)?/?([^/]+)?/?([^/]+)?/?([^/]+)?/?([^/]+)?/?([^/]+)?',
    to: '/service.php?design_code_id=$1&site_class_id=$2' +
        '&risk_category_id=$3&longitude=$4&latitude=$5&title=$6'
  },
  {
    from: '^' + iniConfig.MOUNT_PATH + '/?(.*)$',
    to: '/$1'
  }
];

var corsMiddleware = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers',
      'accept,origin,authorization,content-type');
  return next();
};

var addMiddleware = function (connect, options, middlewares) {
  middlewares.unshift(
    require('grunt-connect-proxy/lib/utils').proxyRequest,
    require('http-rewrite-middleware').getMiddleware(rewrites),
    corsMiddleware,
    require('gateway')(options.base[0], {
      '.php': 'php-cgi',
      'env': {
        'PHPRC': 'node_modules/hazdev-template/dist/conf/php.ini'
      }
    })
  );
  return middlewares;
};


var connect = {
  options: {
    hostname: '*'
  },

  proxies: [
    {
      context: '/theme/',
      host: 'localhost',
      port: config.templatePort,
      rewrite: {
        '^/theme': ''
      }
    }
  ],


  dev: {
    options: {
      base: [config.build + '/' + config.src + '/htdocs'],
      livereload: config.liveReloadPort,
      middleware: addMiddleware,
      open: 'http://localhost:' + config.buildPort + iniConfig.MOUNT_PATH +
          '/index.php',
      port: config.buildPort
    }
  },

  dist: {
    options: {
      base: [config.dist + '/htdocs'],
      middleware: addMiddleware,
      open: 'http://localhost:' + config.distPort + iniConfig.MOUNT_PATH +
          '/index.php',
      port: config.distPort
    }
  },

  example: {
    options: {
      base: [
        config.example,
        config.build + '/' + config.src + '/htdocs',
        'node_modules/hazdev-template/dist/htdocs'
      ],
      middleware: function (connect, options, middlewares) {
        middlewares.unshift(require('gateway')(
          config.build + '/' + config.src + '/htdocs', {
            '.php': 'php-cgi',
            'env': {
              'PHPRC': 'node_modules/hazdev-template/dist/conf/php.ini'
            }
          })
        );

        return middlewares;
      },
      open: 'http://localhost:' + config.examplePort + '/example.html',
      port: config.examplePort
    }
  },

  test: {
    options: {
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src + '/htdocs',
        'node_modules' // primarily for mocha/chai
      ],
      open: 'http://localhost:' + config.testPort + '/test.html',
      port: config.testPort
    }
  },

  template: {
    options: {
      base: ['node_modules/hazdev-template/dist/htdocs'],
      port: config.templatePort
    }
  }
};

module.exports = connect;
