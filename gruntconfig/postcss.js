'use strict';

var autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    precss = require('precss'),
    postcssImport = require('postcss-import');

var config = require('./config'),
    CWD = '.';

var postcss = {

  dev: {
    options: {
      processors: [
        postcssImport({
          path: [
            CWD + '/' + config.src + '/htdocs/css',
            CWD + '/node_modules/hazdev-accordion/src',
            CWD + '/node_modules/hazdev-location-view/src',
            CWD + '/node_modules/hazdev-template/src/htdocs',
            CWD + '/node_modules/hazdev-webutils/src',
            CWD + '/node_modules/leaflet/dist'
          ]
        }),
        precss(),
        autoprefixer({'browsers': 'last 2 versions'})
      ]
    },
    expand: true,
    cwd: config.src + '/htdocs',
    src: 'css/index.scss',
    dest: config.build + '/' + config.src + '/htdocs',
    ext: '.css',
    extDot: 'last'
  },

  dist: {
    options: {
      processors: [
        cssnano({zindex: false}) // minify
      ]
    },
    src: config.build + '/' + config.src + '/htdocs/css/index.css',
    dest: config.dist + '/htdocs/css/index.css'
  }
};

module.exports = postcss;
