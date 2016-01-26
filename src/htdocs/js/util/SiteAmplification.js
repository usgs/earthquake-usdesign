'use strict';

var Formatter = require('util/Formatter'),
    Util = require('util/Util');

// Bins provided by defaults are valid for 2015 NEHRP
var _DEFAULTS = {
  faTitle: 'Spectral Reponse Acceleration Parameter at Short Period',

  fpgaTitle: 'Mapped MCE Geometric Mean (MCE<sub>G</sub>) Peak Ground ' +
      'Acceleration',

  fvTitle: 'Spectral Response Acceleration Parameter at 1-Second Period',

  ssInfo: {
    bins: [0.25, 0.50, 0.75, 1.00, 1.25, 1.50],
    siteClasses: {
      'A': [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      'B (measured)': [0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
      'B (unmeasured)': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      'C': [1.3, 1.3, 1.2, 1.2, 1.2, 1.2],
      'D (determined)': [1.6, 1.4, 1.2, 1.1, 1.0, 1.0],
      'D (default)': [1.6, 1.4, 1.2, 1.2, 1.2, 1.2],
      'E': [2.4, 1.7, 1.3, 1.2, 1.2, 1.2]
    }
  },
  s1Info: {
    bins: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60],
    siteClasses: {
      'A': [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      'B (measured)': [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      'B (unmeasured)': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      'C': [1.5, 1.5, 1.5, 1.5, 1.5, 1.4],
      'D (determined)': [2.4, 2.2, 2.0, 1.9, 1.8, 1.7],
      'D (default)': [2.4, 2.2, 2.0, 1.9, 1.8, 1.7],
      'E': [4.2, 3.3, 2.8, 2.4, 2.2, 2.0]
    }
  },
  pgaInfo: {
    bins: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60],
    siteClasses: {
      'A': [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      'B (measured)': [0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
      'B (unmeasured)': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      'C': [1.3, 1.2, 1.2, 1.2, 1.2, 1.2],
      'D (determined)': [1.6, 1.4, 1.3, 1.2, 1.1, 1.1],
      'D (default)': [1.6, 1.4, 1.3, 1.2, 1.2, 1.2],
      'E': [2.4, 1.9, 1.6, 1.4, 1.2, 1.1]
    }
  },
  supInfo: {
    fa: {
      'A': ['', '', '', '', '', ''],
      'B (measured)': ['', '', '', '', '', ''],
      'B (unmeasured)': ['', '', '', '', '', ''],
      'C': ['', '', '', '', '', ''],
      'D (determined)': ['', '', '', '', '', ''],
      'D (default)': ['', '', '', '', '', ''],
      'E': ['', '', '', ' <sup>1</sup>', ' <sup>1</sup>', ' <sup>1</sup>']
    },
    fv: {
      'A': ['', '', '', '', '', ''],
      'B (measured)': ['', '', '', '', '', ''],
      'B (unmeasured)': ['', '', '', '', '', ''],
      'C': ['', '', '', '', '', ''],
      'D (determined)': ['', ' <sup>1</sup>', ' <sup>1</sup>', ' <sup>1</sup>',
          ' <sup>1</sup>', ' <sup>1</sup>'],
      'D (default)': ['', ' <sup>1</sup>', ' <sup>1</sup>', ' <sup>1</sup>',
          ' <sup>1</sup>', ' <sup>1</sup>'],
      'E': ['', ' <sup>1</sup>', ' <sup>1</sup>', ' <sup>1</sup>',
          ' <sup>1</sup>', ' <sup>1</sup>']
    },
    fpga: {
      'A': ['', '', '', '', '', ''],
      'B (measured)': ['', '', '', '', '', ''],
      'B (unmeasured)': ['', '', '', '', '', ''],
      'C': ['', '', '', '', '', ''],
      'D (determined)': ['', '', '', '', '', ''],
      'D (default)': ['', '', '', '', '', ''],
      'E': ['', '', '', '', '', '']
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
      _supInfo,

      _getBounds,
      _getFactor,
      _getTable,
      _getTableBody,
      _getTableHeader,
      _interpolate;


  _this = {
    'getFa': null,
    'getFaTable': null,
    'getFpga': null,
    'getFpgaTable': null,
    'getFv': null,
    'getFvTable': null,
    // 'getUndeterminedPgaTable': null,
    // 'getUndeterminedSsS1Table': null,

    'destroy': null
  };

  _initialize = function (params) {
    params = Util.extend({}, _DEFAULTS, params);

    _faTitle = params.faTitle;
    _fvTitle = params.fvTitle;
    _fpgaTitle = params.fpgaTitle;

    _ssInfo = params.ssInfo;
    _s1Info = params.s1Info;
    _supInfo = params.supInfo;
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
        current,
        len,
        previous;

    bounds = {lower: null, upper: null};
    len = xvals.length;

    if (x <= xvals[0]) {
      bounds.lower = 0;
      bounds.upper = 0;
    } else if (x >= xvals[len - 1]) {
      bounds.lower = len - 1;
      bounds.upper = len - 1;
    } else {
      for (current = 1; current < len; current++) {
        previous = current - 1;

        if (x === xvals[previous]) {
          bounds.lower = previous;
          bounds.upper = previous;
        } else if (x > xvals[previous] && x < xvals[current]) {
          bounds.lower = previous;
          bounds.upper = current;
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

    if (lower === null || upper === null) {
      // shouldn't happen, but in any case
      throw new Error('Failed to find acceleration bounds for input');
    } else if (lower === upper) {
      return yvals[upper];
    } else {
      return _interpolate(xvals[lower], xvals[upper], yvals[lower],
          yvals[upper], x);
    }
  };

  _getTable = function (acceleration, siteClass, info, title, unit, supInfo) {
    var bounds,
        table;

    bounds = _getBounds(info.bins, acceleration);

    table = document.createElement('table');
    table.classList.add('site-amplification-table');
    table.innerHTML = [
      '<thead>',
        _getTableHeader(title, unit, info.bins),
      '</thead>',
      '<tbody>',
        _getTableBody(info.siteClasses, siteClass, bounds, supInfo),
      '</tbody>'
    ].join('');

    return table;
  };

  _getTableBody = function (data, siteClass, bounds, supInfo) {
    var classes,
        i,
        label,
        len,
        markup,
        superscripts,
        values;

    markup = [];

    for (label in data) {
      values = data[label];
      superscripts = supInfo[label];

      markup.push('<tr class="site-class-' + label + '">' +
          '<th scope="row">' + label + '</th>');

      for (i = 0, len = values.length; i < len; i++) {
        classes = '';

        if (label === siteClass) {
          if (i === bounds.lower || i === bounds.upper) {
            classes += ' bound';
          }
          if (i === bounds.lower) {
            classes += ' lower';
          }
          if (i === bounds.upper) {
            classes += ' upper';
          }
        }

        markup.push('<td class="' + classes + '">' +
          Formatter.siteAmplificationValue(values[i]) +
          superscripts[i] +
        '</td>');
      }

      markup.push('</tr>');
    }

    return markup.join('') + '<tr class="site-class-F">' +
      '<th scope="row">F</th>' +
      '<td colspan="' + data[siteClass].length + '">' +
        'See Section 11.4.7' +
      '</td>';
  };

  _getTableHeader = function (title, type, headers) {
    var comparator,
        i,
        len,
        markup;

    markup = [
      '<tr>',
        '<th scope="col" rowspan="2">Site Class</th>',
        '<th colspan="', headers.length, '">', title, '</th>',
      '</tr>',
      '<tr>'
    ];

    for (i = 0, len = headers.length; i < len; i++) {
      if (i === 0) {
        comparator = ' &le; ';
      } else if (i === (len - 1)) {
        comparator = ' &ge; ';
      } else {
        comparator = ' = ';
      }

      markup.push('<th scope="col">' +
        type + comparator + Formatter.siteAmplificationHeader(headers[i]) +
      '</th>');
    }

    return markup.join('') + '</tr>';
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

  _this.getFaTable = function (acceleration, siteClass) {
    return _getTable(acceleration, siteClass, _ssInfo, _faTitle,
        'S<sub>S</sub>', _supInfo.fa);
  };

  _this.getFv = function (acceleration, siteClass) {
    return _getFactor(_s1Info.bins, _s1Info.siteClasses[siteClass],
        acceleration);
  };

  _this.getFvTable = function (acceleration, siteClass) {
    return _getTable(acceleration, siteClass, _s1Info, _fvTitle,
        'S<sub>1</sub>', _supInfo.fv);
  };

  _this.getFpga = function (acceleration, siteClass) {
    return _getFactor(_pgaInfo.bins, _pgaInfo.siteClasses[siteClass],
        acceleration);
  };

  _this.getFpgaTable = function (acceleration, siteClass) {
    return _getTable(acceleration, siteClass, _pgaInfo, _fpgaTitle, 'PGA',
        _supInfo.fpga);
  };

  // _this.getUndeterminedPgaTable = function (pga, siteClass) {
  //   var comparator,

  //       bounds,
  //       classes,
  //       headers,
  //       vals,

  //       i,
  //       len,
  //       table;

  //   headers =[];
  //   vals = [];

  //   len = _pgaInfo.bins.length;

  //   bounds = _getBounds(_pgaInfo.bins, pga);

  //   for (i = 0; i < len; i++) {
  //     classes = '';

  //     if (siteClass === 'U-D') {
  //       if (i === bounds.lower || i === bounds.upper) {
  //         classes = 'bound';

  //         if (i === bounds.lower) {
  //           classes += ' lower';
  //         }
  //         if (i === bounds.upper) {
  //           classes += ' upper';
  //         }
  //       }
  //     }

  //     if (i === 0) {
  //       comparator = '&le;';
  //     } else if (i === (len - 1)) {
  //       comparator = '&ge;';
  //     } else {
  //       comparator = '=';
  //     }

  //     headers.push('<th scope="col">PGA ' + comparator + ' ' +
  //         _pgaInfo.bins[i] + '</th>');
  //     vals.push('<td class="' + classes + '">' +
  //         _pgaInfo.siteClasses.U[i] + '</td>');
  //   }

  //   table = document.createElement('table');
  //   table.classList.add('site-amplification-table');
  //   table.classList.add('site-amplification-table-undetermined');

  //   table.innerHTML = [
  //     '<thead>',
  //       '<tr>',
  //         '<th scope="col" rowspan="2">Site Coefficient</th>',
  //         '<th colspan="', len, '">',
  //           'Mapped MCE Geometric Mean Peak Ground Acceleration, PGA',
  //         '</th>',
  //       '</tr>',
  //       '<tr>', headers.join(''), '</tr>',
  //     '</thead>',
  //     '<tbody>',
  //       '<tr><th scope="row">F<sub>PGA</sub></th>', vals.join(''), '</tr>',
  //     '</tbody>'
  //   ].join('');

  //   return table;
  // };

  // _this.getUndeterminedSsS1Table = function (ss, s1, siteClass) {
  //   var comparator,

  //       faBounds,
  //       faClasses,
  //       faHeaders,
  //       faVals,

  //       fvBounds,
  //       fvClasses,
  //       fvHeaders,
  //       fvVals,

  //       i,
  //       len,
  //       table;

  //   faHeaders = [];
  //   fvHeaders = [];
  //   faVals = [];
  //   fvVals = [];

  //   len = _ssInfo.bins.length;

  //   faBounds = _getBounds(_ssInfo.bins, ss);
  //   fvBounds = _getBounds(_s1Info.bins, s1);

  //   for (i = 0; i < len; i++) {
  //     faClasses = '';
  //     fvClasses = '';

  //     if (siteClass === 'U-D') {
  //       if (i === faBounds.lower || i === faBounds.upper) {
  //         faClasses += 'bound';

  //         if (i === faBounds.lower) {
  //           faClasses += ' lower';
  //         }
  //         if (i === faBounds.upper) {
  //           faClasses += ' upper';
  //         }
  //       }

  //       if (i === fvBounds.lower || i === fvBounds.upper) {
  //         fvClasses = 'bound';

  //         if (i === fvBounds.lower) {
  //           fvClasses += ' lower';
  //         }
  //         if (i === fvBounds.upper) {
  //           fvClasses += ' upper';
  //         }
  //       }
  //     }

  //     if (i === 0) {
  //       comparator = '&le;';
  //     } else if (i === (len - 1)) {
  //       comparator = '&ge;';
  //     } else {
  //       comparator = '=';
  //     }

  //     faHeaders.push('<th scope="col">S<sub>S</sub> ' + comparator + ' ' +
  //         Formatter.siteAmplificationHeader(_ssInfo.bins[i]) + '</th>');
  //     faVals.push('<td class="' + faClasses + '">' +
  //         _ssInfo.siteClasses.U[i] + '</td>');

  //     fvHeaders.push('<th scope="col">S<sub>1</sub> ' + comparator + ' ' +
  //         Formatter.siteAmplificationHeader(_s1Info.bins[i]) + '</th>');
  //     fvVals.push('<td class="' + fvClasses + '">' +
  //         _s1Info.siteClasses.U[i] + '</td>');
  //   }

  //   table = document.createElement('table');
  //   table.classList.add('site-amplification-table');
  //   table.classList.add('site-amplification-table-undetermined');
  //   table.innerHTML = [
  //       '<thead>',
  //         '<tr>',
  //           '<th scope="col" rowspan="2">Site Coefficient</th>',
  //           '<th colspan="', len, '">',
  //             'Spectral Response Acceleration Parameters',
  //           '</th>',
  //         '</tr>',
  //         '<tr>', faHeaders.join(''), '</tr>',
  //       '</thead>',
  //       '<tbody>',
  //         '<tr><th scope="row">F<sub>a</sub></th>', faVals.join(''), '</tr>',
  //         '<tr class="header"><th>&nbsp;</th>', fvHeaders.join(''), '</tr>',
  //         '<tr><th scope="row">F<sub>v</sub></th>', fvVals.join(''), '</tr>',
  //       '</tbody>'
  //   ].join('');

  //   return table;
  // };

  _this.destroy = function () {
    _faTitle = null;
    _fvTitle = null;
    _fpgaTitle = null;

    _ssInfo = null;
    _s1Info = null;
    _supInfo = null;
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
