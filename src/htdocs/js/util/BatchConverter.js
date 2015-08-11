'use strict';

var Calculation = require('Calculation'),
    NEHRPCalc2015 = require('NEHRPCalc2015'),

    Events = require('util/Events'),
    Util = require('util/Util');


var __strip_tags = function (str) {
  // TODO :: Can this be better ?
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

var __format_float = function (float) {
  return float.toFixed(5);
};

var _DEFAULTS = {
  greedyTitle: true, // title is all remaining columns
  headers: {
    latitude: {index: 0, format: parseFloat},
    longitude: {index: 1, format: parseFloat},
    site_class: {index: 2, format: parseInt},
    risk_category: {index: 3, format: parseInt},
    design_code: {index: 4, format: parseInt},
    title: {index: 5, format: __strip_tags}
  },
};

var BatchConverter = function (params) {
  var _this,
      _initialize,

      _greedyTitle,
      _headers,

      _getCalculator,
      _getHeaders,
      _isHeaderLine,
      _setHeaders,
      _toCalculation,
      _toCSV;


  _this = Events();

  _initialize = function (params) {
    params = Util.extend({}, _DEFAULTS, params);

    _greedyTitle = params.greedyTitle;
    _headers = params.headers;
  };


  _getCalculator = function (/*calculation*/) {
    // TODO :: Look at design code on calculation and choose an appropriate
    //         calculator.
    return NEHRPCalc2015();
  };

  _getHeaders = function () {
    var csv;

    // TODO :: Put inputs in order as specified by _headers
    csv = [
      // Inputs
      'latitude', 'longitude', 'site_class',
      'risk_category', 'design_code',
      'title',

      // Outputs
      'crs', 'cr1',
      'ssuh', 's1uh',
      'ssd', 's1d',

      'ss', 's1', 'pga',
      'fa', 'fv', 'fpga',
      'sms', 'sm1', 'pgam',
      'sds', 'sd1', 'tl'
    ];

    return csv.join(',');
  };

  _isHeaderLine = function (line) {
    return Object.keys(_headers).every(function (column) {
      return (line.indexOf(column) !== -1);
    });
  };

  _setHeaders = function (line) {
    var fields;

    fields = line.split(',');

    fields.forEach(function (field, i) {
      if (_headers.hasOwnProperty(field)) {
        _headers[field].index = i;
      }
    });

    if (_headers.title.index === (fields.length - 1)) {
      _greedyTitle = true;
    } else {
      _greedyTitle = false;
    }
  };

  _toCalculation = function (csv) {
    var fields,
        input,
        numFields;

    fields = csv.split(',');
    numFields = fields.length;

    input = {
      latitude: null,
      longitude: null,
      site_class: null,
      risk_category: null,
      design_code: null,
      title: null
    };


    Object.keys(_headers).forEach(function (column) {
      var format,
          header,
          index,
          value;

      if (_headers.hasOwnProperty(column)) {
        header = _headers[column];
        index = header.index;
        format = header.format;

        if (numFields <= index) {
          throw new Error('Input missing field "' + column + '".');
        } else if (_greedyTitle && column === 'title') {
          value = format(fields.slice(index).join(','));
        } else {
          value = format(header.format(fields[index]));
        }

        if (format && typeof format === 'function') {
          value = format(value);
        }

        input[column] = value;
      }
    });

    return Calculation({input: input});
  };

  _toCSV = function (model) {
    var calc,
        csv,
        input,
        meta,
        output,
        result;

    calc = _getCalculator(model);

    result = model.get('result');
    input = model.get('input');
    output = model.get('output');

    meta = output.get('metadata');

    csv = [
      // Inputs
      input.get('latitude'), input.get('longitude'), input.get('site_class'),
      input.get('risk_category'), input.get('design_code'),
      '"' + input.get('title').replace(/"/g, '\\"') + '"',

      // Outputs
      __format_float(result.get('crs')), __format_float(result.get('cr1')),
      __format_float(calc.getSsuh(model)), __format_float(calc.getS1uh(model)),
      __format_float(calc.getSsd(model)), __format_float(calc.getS1d(model)),

      __format_float(calc.getSs(model)), __format_float(calc.getS1(model)),
      __format_float(calc.getPga(model)),

      __format_float(calc.getFa(model)), __format_float(calc.getFv(model)),
      __format_float(calc.getFpga(model)),

      __format_float(calc.getSms(model)), __format_float(calc.getSm1(model)),
      __format_float(calc.getPgam(model)),

      __format_float(calc.getSds(model)), __format_float(calc.getSd1(model)),
      output.get('tl')
    ];

    return csv.join(',');
  };


  _this.destroy = function () {
    _greedyTitle = null;
    _headers = null;

    _getCalculator = null;
    _getHeaders = null;
    _isHeaderLine = null;
    _setHeaders = null;
    _toCalculation = null;
    _toCSV = null;


    _initialize = null;
    _this = null;
  };

  /**
   * Parses the input file contents into an array of calculations.
   *
   * @param content {String}
   *      CSV formatted batch file content.
   *
   * @return {Array}
   *      An array of Caluclation objects parsed from the input file model.
   */
  _this.toCalculation = function (content) {
    var calculation,
        lines,
        result;

    result = [];
    lines = content.split('\n');

    lines.forEach(function (line, lineNum) {
      line = line.trim();

      if (!line) {
        return;
      } else if (_isHeaderLine(line)) {
        _setHeaders(line);
      } else {
        try {
          calculation = _toCalculation(line);
          if (calculation) {
            result.push(calculation);
          } else {
            throw new Error('Failed to parse calculation for line #' +
                lineNum + '.');
          }
        } catch (e) {
          _this.trigger('error', e.message);
        }
      }
    });

    return result;
  };


  _this.toCSV = function (calculations) {
    var csv;

    csv = [_getHeaders()];

    calculations.forEach(function (calculation) {
      if (calculation.get('status') !== Calculation.STATUS_COMPLETE) {
        // TODO :: Trigger an error ?
        return; // Skip calculations that are not complete
      }

      csv.push(_toCSV(calculation));
    });

    return csv.join('\n');
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = BatchConverter;
