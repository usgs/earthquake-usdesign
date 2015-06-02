'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),

    Util = require('util/Util');


var _CALCULATION_MODE_INPUT = 'input',
    _CALCULATION_MODE_OUTPUT = 'output';

var _DEFAULTS = {
  mode: _CALCULATION_MODE_INPUT,
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

      _generateId;


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

    _this.set(attributes, {silent: true});
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


  _initialize(params);
  params = null;
  return _this;
};

Calculation.MODE_INPUT = _CALCULATION_MODE_INPUT;
Calculation.MODE_OUTPUT = _CALCULATION_MODE_OUTPUT;

module.exports = Calculation;
