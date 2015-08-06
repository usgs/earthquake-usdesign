'use strict';

var Calculation = require('Calculation'),
    NEHRPCalc2015 = require('NEHRPCalc2015'),

    Events = require('util/Events'),
    Util = require('util/Util');


var __strip_tags = function (str) {
  // TODO :: Can this be better ?
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

    if (_headers.title.index === fields.length) {
      _greedyTitle = true;
    } else {
      _greedyTitle = false;
    }
  };

  _toCalculation = function (csv) {
    var fields,
        input;

    fields = csv.split(',');

    input = {
      latitude: null,
      longitude: null,
      site_class: null,
      risk_cateogory: null,
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

        if (_greedyTitle && column === 'title') {
          value = format(fields.slice(index).join(', '));
        } else {
          value = format(header.format(fields[index]));
        }

        if (format && typeof format === 'functin') {
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
        output;

    calc = _getCalculator(model);

    input = model.get('input');
    output = model.get('output');
    meta = output.get('metadata');

    csv = [
      // Inputs
      input.get('latitude'), input.get('longitude'), input.get('site_class'),
      input.get('risk_category'), input.get('design_code'),
      '"' + input.get('title').replace(/"/g, '\\"') + '"',

      // Outputs
      meta.get('crs'), meta.get('cr1'),
      calc.getSsuh(model), calc.getS1uh(model),
      calc.getSsd(model), calc.getS1d(model),

      calc.getSs(model), calc.getS1(model), calc.getPga(model),

      calc.getFa(model), calc.getFv(model), calc.getFpga(model),
      calc.getSms(model), calc.getSm1(model), calc.getPgam(model),
      calc.getSds(model), calc.getSd1(model), output.get('tl')
    ];
  };


  _this.destroy = function () {
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

    lines = content.split('\n');

    lines.forEach(function (line) {
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
          }
        } catch (e) {
          _this.trigger('error', e.message);
        }
      }
    });
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
