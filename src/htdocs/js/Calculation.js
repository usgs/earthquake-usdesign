'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),

    Util = require('util/Util');


var _MODE_INPUT = 'input',
    _MODE_OUTPUT = 'output';


var _STATUS_NEW = 'new',
    _STATUS_INVALID = 'invalid',
    _STATUS_READY = 'ready',
    _STATUS_SENT = 'sent',
    _STATUS_COMPLETE = 'complete';


var _DEFAULTS = {
  mode: _MODE_INPUT,

  status: _STATUS_NEW,

  input: {
    title: null,
    latitude: null,
    longitude: null,
    design_code: null,
    risk_category: null,
    site_class: null
  },

  output: {
    metadata: {
      max_direction_ss: null,
      max_direction_s1: null,

      percentile_ss: null,
      percentile_s1: null,
      percentile_pga: null,

      deterministic_floor_ss: null,
      deterministic_floor_s1: null,
      deterministic_floor_pga: null,

      interpolation_method: null
    },

    tl: null,

    data: [
      {
        latitude: null,
        longitude: null,

        mapped_ss: null,
        crs: null,
        geomean_ssd: null,

        mapped_s1: null,
        cr1: null,
        geomean_s1d: null,

        mapped_pga: null,
        geomean_pgad: null
      }
    ]
  },

  result: {
  }
};

var _ID_SEQUENCE = 0;

/**
 * A Calculation is a representation of what is returned by the web service. It
 * consists of both the input (request) and output (response) information. See
 * the _DEFAULTS for more information about what is included in a calculation.
 *
 * @param params {Object}
 *      An object containing the calculation information. See: _DEFAULTS
 */
var Calculation = function (params) {
  var _this,
      _initialize,

      _generateId,
      _updateStatus;


  _this = Model(params);

  /**
   * @Constructor
   *
   * Initializes a new Calculation instance. Ensures the calculation has
   * an id.
   */
  _initialize = function (/*params*/) {
    var attributes,
        id,
        input,
        mode,
        output,
        result;

    id = _this.get('id');
    mode = _this.get('mode') || _DEFAULTS.mode;
    attributes = _this.get();

    input = Util.extend({}, _DEFAULTS.input, attributes.input);
    output = Util.extend({}, _DEFAULTS.output, attributes.output);
    result = Util.extend({}, _DEFAULTS.result, attributes.result);

    output.metadata = Model(Util.extend({}, _DEFAULTS.output.metadata,
        output.metadata));

    if (output.data) {
      output.data = Collection(output.data.map(Model));
    } else {
      output.data = Collection(_DEFAULTS.output.data.map(Model));
    }

    attributes = {
      input: Model(input),
      output: Model(output),
      result: Model(result),
      mode: mode
    };


    // Make sure each Calculation model has an id. This is important since they
    // will certainly be in a Collection
    if (typeof id === 'undefined' || id === null) {
      attributes.id = _generateId();
    }

    _this.on('change', _updateStatus);
    _this.set(attributes);
  };


  /**
   * Generates a unique id for the calulation.
   *
   */
  _generateId = function () {
    return 'Calculation-' + ((new Date()).getTime()) + '-' + (_ID_SEQUENCE++);
  };


  /**
   * Calls parent destroy method then frees local allocations.
   *
   */
  _this.destroy = Util.compose(_this.destroy, function () {
    _generateId = null;

    _initialize = null;
    _this = null;
  });

  /**
   * Check current input parameters and set calculation status.
   *
   * Does nothing when status is STATUS_COMPLETE or STATUS_SENT.
   * Verifies all input parameters are specified and:
   *   - if not null, sets STATUS_READY
   *   - otherwise, sets STATUS_INVALID
   */
  _updateStatus = function () {
    var input,
        status;

    status = _this.get('status');
    if (status === _STATUS_COMPLETE || status === _STATUS_SENT) {
      return;
    }

    input = _this.get('input');
    if (input.title === null ||
        input.latitude === null ||
        input.longitude === null ||
        input.design_code === null ||
        input.risk_category === null ||
        input.site_class === null) {
      _this.set({
        status: _STATUS_INVALID
      });
    } else {
      _this.set({
        status: _STATUS_READY
      });
    }
  };

  _initialize(params);
  params = null;
  return _this;
};

Calculation.MODE_INPUT = _MODE_INPUT;
Calculation.MODE_OUTPUT = _MODE_OUTPUT;

Calculation.STATUS_NEW = _STATUS_NEW;
Calculation.STATUS_INVALID = _STATUS_INVALID;
Calculation.STATUS_READY = _STATUS_READY;
Calculation.STATUS_SENT = _STATUS_SENT;
Calculation.STATUS_COMPLETE = _STATUS_COMPLETE;

module.exports = Calculation;
