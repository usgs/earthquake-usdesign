'use strict';

var Util = require('util/Util');

// Bins provided by defaults are valid for 2015 NEHRP
var _DEFAULTS = {
  faTitle: 'Mapped Risk-Targeted Maximum Considered Earthquake ' +
      '(MCE<sub>R</sub>) Spectral Response Acceleration Parameter at ' +
      'Short Period',

  fpgaTitle: 'Mapped Maximum Considered Geometric Mean ' +
      '(MCE<sub>G</sub>) Peak Ground Acceleration, PGA',

  fvTitle: 'Mapped Risk-Targeted Maximum Considered Earthquake ' +
      '(MCE<sub>R</sub>) Spectral Response Acceleration Parameter at ' +
      '1-s Period',

  ssInfo: {
    bins: [0.25, 0.50, 0.75, 1.00, 1.25, 1.50],
    siteClasses: {
      'A': [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      'B': [0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
      'C': [1.3, 1.3, 1.2, 1.2, 1.2, 1.2],
      'D': [1.6, 1.4, 1.2, 1.1, 1.0, 1.0],
      'E': [2.4, 1.7, 1.3, 1.1, 1.0, 0.8],
      'U': [1.6, 1.4, 1.2, 1.2, 1.2, 1.2]
    }
  },
  s1Info: {
    bins: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60],
    siteClasses: {
      'A': [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      'B': [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      'C': [1.5, 1.5, 1.5, 1.5, 1.5, 1.4],
      'D': [2.4, 2.2, 2.0, 1.9, 1.8, 1.7],
      'E': [4.2, 3.3, 2.8, 2.4, 2.2, 2.0],
      'U': [2.4, 2.2, 2.0, 1.9, 1.8, 1.7]
    }
  },
  pgaInfo: {
    bins: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60],
    siteClasses: {
      'A': [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      'B': [0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
      'C': [1.3, 1.2, 1.2, 1.2, 1.2, 1.2],
      'D': [1.6, 1.4, 1.3, 1.2, 1.1, 1.1],
      'E': [2.4, 1.9, 1.6, 1.4, 1.2, 1.1],
      'U': [1.6, 1.4, 1.3, 1.2, 1.2, 1.2]
    }
  }
};

var SiteAmplification = function (params) {
  var _this,
      _initialize,

      _faTitle,
      _fpgaTitle,
      _fvTitle,

      _pgaInfo,
      _s1Info,
      _ssInfo,

      _getBounds,
      _getFactor,
      _getTable,
      _getTableBody,
      _getTableHeader,
      _interpolate;


  _this = {
    'getFa': null,
    'getFaHtml': null,
    'getFpga': null,
    'getFpgaHtml': null,
    'getFv': null,
    'getFvHtml': null,
    'getUndeterminedPgaTable': null,
    'getUndeterminedSsS1Table': null,

    'destroy': null
  };

  _initialize = function (params) {
    params = Util.extend({}, _DEFAULTS, params);

    _faTitle = params.faTitle;
    _fvTitle = params.fvTitle;
    _fpgaTitle = params.fpgaTitle;

    _ssInfo = params.ssInfo;
    _s1Info = params.s1Info;
    _pgaInfo = params.pgaInfo;
  };


/**
   * @param xvals {Array}
   *      An array of x-values to search.
   * @param x {Number}
   *      The x-value for which to find the bounds
   *
   * @return {Object}
   *      An object with lower/upper bound indices corresponding to the
   *      x-values that most closely bound the x-value.
   */
  _getBounds = function (xvals, x) {
    var bounds,
        i,
        len;

    bounds = {lower: null, upper: null};
    len = xvals.length;

    if (x <= xvals[0]) {
      bounds.upper = 0;
    } else if (x >= xvals[len - 1].value) {
      bounds.lower = len - 1;
    } else {
      for (i = 1; i < len; i++) {
        if (x >= xvals[i - 1] && x <= xvals[i]) {
          bounds.lower = i - 1;
          bounds.upper = i;
        }
      }
    }

    return bounds;
  };

  /**
   * Gets the amplification factor for the given spectral acceleration bins
   * (xvals) and corresponding amplification factors (yvals) for the given
   * spectral acceleration value (x).
   *
   * @param xvals {Array}
   *      An array of strictly increasing spectral acceleration value to search.
   * @param yvals {Array}
   *      An array of site amplification factors to interpolate between.
   * @param x {Number}
   *      The spectral acceleration value to interpolate for.
   *
   * @return {Number}
   *      The site amplification factor.
   */
  _getFactor = function (xvals, yvals, x) {
    var bounds,
        lower,
        upper;


    bounds = _getBounds(xvals, x);
    lower = bounds.lower;
    upper = bounds.upper;

    if (lower === null && upper === null) {
      // shouldn't happen, but in any case
      throw new Error('Failed to find acceleration bounds for input');
    } else if (lower === null) {
      return yvals[upper];
    } else if (upper === null) {
      return yvals[lower];
    } else {
      return _interpolate(xvals[lower], xvals[upper], yvals[lower],
          yvals[upper], x);
    }
  };

  _getTable = function (acceleration, siteClass, info, title, unit) {
    var bounds;

    bounds = _getBounds(info.bins, acceleration);

    return [
      '<table class="tabular">',
        '<thead>',
          _getTableHeader(title, unit, info.bins),
        '</thead>',
        '<tbody>',
          _getTableBody(info.siteClasses, siteClass, bounds),
        '</tbody>',
      '<table>'
    ].join('');
  };

  _getTableBody = function (data, siteClass, bounds) {
    var classes,
        i,
        label,
        len,
        markup,
        values;

    for (label in data) {
      if (label === 'U') {
        // Skip undetermined site class for this table
        continue;
      }

      values = data[label];

      markup.push('<tr class="site-class-' + label + '">' +
          '<th scope="row">' + label + '</th>');

      for (i = 0, len = values.length; i < len; i++) {
        classes = '';

        if (label === siteClass) {
          if (i === bounds.lower) {
            classes = ' class="lower bound"';
          } else if (i === bounds.upper) {
            classes = ' class="upper bound"';
          }
        }

        markup.push('<td' + classes + '>' + values[i] + '</td>');
      }

      markup.push('</tr>');
    }

    return markup.join('') + '<tr class="site-class-F">' +
      '<th scope="row">F</th>' +
      '<td colspan="' + data[siteClass].length + '">' +
        'See Section 11.4.7 of ASCE 7' +
      '</td>';
  };

  _getTableHeader = function (title, type, headers) {
    var i,
        len,
        markup;

    markup = [
      '<tr>',
        '<th scope="col" rowspan="2">Site class</th>',
        '<th colspan="', headers.length, '">', title, '</th>',
      '</tr>',
      '<tr>',
        '<th scope="col">', type, ' &lte; ', headers[0], '</th>'
    ];

    for (i = 1, len = headers.length - 1; i < len; i++) {
      markup.push('<th scope="col">' + type + ' = ' + headers[i] + '</th>');
    }

    markup.push('<th scope="col">' + type + ' &gte; ' + headers[i] +
        '</th></tr>');

    return markup.join('');
  };

  /**
   * @param x0 {Number}
   *      The x-value of the first point to interpolate between.
   * @param x1 {Number}
   *      The x-value of the second point to interpolate between.
   * @param y0 {Number}
   *      The y-value of the first point to interpolate between.
   * @param y1 {Number}
   *      The y-value of the second point to interpolate between.
   * @param x {Number}
   *      The x-value at which to interpolate.
   */
  _interpolate = function (x0, x1, y0, y1, x) {
    return y0 + ((x - x0) * ((y1 - y0) / (x1 - x0)));
  };


  _this.getFa = function (acceleration, siteClass) {
    return _getFactor(_ssInfo.bins, _ssInfo.siteClasses[siteClass],
        acceleration);
  };

  _this.getFaHtml = function (acceleration, siteClass) {
    return _getTable(acceleration, siteClass, _ssInfo, _faTitle,
        'S<sub>S</sub>');
  };

  _this.getFv = function (acceleration, siteClass) {
    return _getFactor(_s1Info.bins, _s1Info.siteClasses[siteClass],
        acceleration);
  };

  _this.getFvHtml = function (acceleration, siteClass) {
    return _getTable(acceleration, siteClass, _ssInfo, _faTitle,
        'S<sub>1</sub>');
  };

  _this.getFpga = function (acceleration, siteClass) {
    return _getFactor(_pgaInfo.bins, _pgaInfo.siteClasses[siteClass],
        acceleration);
  };

  _this.getFpgaHtml = function (acceleration, siteClass) {
    return _getTable(acceleration, siteClass, _ssInfo, _faTitle, 'PGA');
  };

  _this.getUndeterminedPgaTable = function (pga, siteClass) {
    var comparator,

        bounds,
        classes,
        headers,
        vals,

        i,
        len;

    len = _pgaInfo.bins.length;

    bounds = _getBounds(_pgaInfo.bins, pga);

    for (i = 0; i < len; i++) {
      classes = '';

      if (siteClass === 'U') {
        if (i === bounds.lower) {
          classes = 'lower bound';
        }
        if (i === bounds.upper) {
          classes = 'upper bound';
        }
      }

      if (i === 0) {
        comparator = '&lte;';
      } else if (i === (len - 1)) {
        comparator = '&gte;';
      } else {
        comparator = '=';
      }

      headers.push('<th scope="col">PGA ' + comparator + ' ' +
          _pgaInfo.bins[i] + '</th>');
      vals.push('<td class="' + classes + '">' +
          _pgaInfo.siteClasses.U[i] + '</td>');
    }

    return [
      '<table class="tabular">',
        '<thead>',
          '<tr>',
            '<th scope="col" rowspan="2">Site Coefficient</th>',
            '<td colspan="', len, '">',
              'Mapped Maximum Considered Geometric Mean ',
              '(MCE<sub>G</sub>) Peak Ground Acceleration, PGA',
            '</td>',
          '</tr>',
          '<tr>', headers.join(''), '</tr>',
        '</thead>',
        '<tbody>',
          '<tr><th scope="row">F<sub>PGA</sub></th>', vals.join(''), '</tr>',
        '</tbody>',
      '</table>'
    ].join('');
  };

  _this.getUndeterminedSsS1Table = function (ss, s1, siteClass) {
    var comparator,

        faBounds,
        faClasses,
        faHeaders,
        faVals,

        fvBounds,
        fvClasses,
        fvHeaders,
        fvVals,

        i,
        len;

    len = _ssInfo.bins.length;

    faBounds = _getBounds(_ssInfo.bins, ss);
    fvBounds = _getBounds(_s1Info.bins, s1);

    for (i = 0; i < len; i++) {
      faClasses = '';
      fvClasses = '';

      if (siteClass === 'U') {
        if (i === faBounds.lower) {
          faClasses = 'lower bound';
        }
        if (i === faBounds.upper) {
          faClasses = 'upper bound';
        }
        if (i === fvBounds.lower) {
          fvClasses = 'lower bound';
        }
        if (i === fvBounds.upper) {
          fvClasses = 'upper bound';
        }
      }

      if (i === 0) {
        comparator = '&lte;';
      } else if (i === (len - 1)) {
        comparator = '&gte;';
      } else {
        comparator = '=';
      }

      faHeaders.push('<th scope="col">S<sub>S</sub> ' + comparator + ' ' +
          _ssInfo.bins[i] + '</th>');
      faVals.push('<td class="' + faClasses + '">' +
          _ssInfo.siteClasses.U[i] + '</td>');

      fvHeaders.push('<th scope="col">S<sub>1</sub> ' + comparator + ' ' +
          _s1Info.bins[i] + '</th>');
      fvVals.push('<td class="' + fvClasses + '">' +
          _s1Info.siteClasses.U[i] + '</td>');
    }

    return [
      '<table class="tabular">',
        '<thead>',
          '<tr>',
            '<th scope="col" rowspan="2">Site Coefficient</th>',
            '<td colspan="', len, '">',
              'Mapped Risk-Targeted Maximum Considered Earthquake ',
              '(MCE<sub>R</sub>) Spectral Response Acceleration Parameters',
            '</td>',
          '</tr>',
          '<tr>', faHeaders.join(''), '</tr>',
        '</thead>',
        '<tbody>',
          '<tr><th scope="row">F<sub>a</sub></th>', faVals.join(''), '</tr>',
          '<tr><th>&nbsp;</th>', fvHeaders.join(''), '</tr>',
          '<tr><th scope="row">F<sub>v</sub></th>', fvVals.join(''), '</tr>',
        '</tbody>',
      '</table>'
    ].join('');
  };

  _this.destroy = function () {
    _faTitle = null;
    _fvTitle = null;
    _fpgaTitle = null;

    _ssInfo = null;
    _s1Info = null;
    _pgaInfo = null;

    _getBounds = null;
    _getFactor = null;
    _getTable = null;
    _getTableBody = null;
    _getTableHeader = null;
    _interpolate = null;

    _this = null;
    _initialize = null;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = SiteAmplification;
