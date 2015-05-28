'use strict';

var Xhr = require('util/Xhr');

var _DEFAULTS = {
  url: 'service'
};

var WebServiceAccessor = function (params) {
  var _this,
      _initialize,

      _url,

      _buildUrl,
      _updateCalculation;

  _this = {};

  _initialize = function (params) {
    params = params || {};
    _url = params.url || _DEFAULTS.url;
  };

  /**
   * Fetches Usage from usdesign webserver
   * @return: {object}
   *          The json object of how to call the url, and
   *          all usage data.
   */
  _this.getUsage = function (callback) {
    Xhr.ajax({
      url: _url,
      success: function(data) {
        callback(data);
      }
    });
  };

  /**
   * Fetches Results from usdesign webserver.
   *
   * @param calculation {Calculation}
   *          A Calculation Model with the input parameters set.
   * @param callback {function}
   *          The callback function that getResults will call on success.
   *
   * @return: {Calculation}
   *          Calculation Model filled with the input/output data.
   */
  _this.getResults = function (calculation, callback) {
    Xhr.ajax({
        url: _buildUrl(calculation),
        success: function(data) {
          callback(_updateCalculation(calculation, data));
        }
      });
  };

  /**
   * Update Calculation. Called on success from the ajax call to the webserver.
   *
   * @param calculation {Calculation}
   *         The calculation Model orginally passed to getResults.
   * @param data {Object}
   *        The json object passed back by the webserver.
   *
   * @return calculation {Calculation}
   *         Calculation Model filled with the input/output data.
   *
   * @throws: error
   *         if data contains the error message, an error is thrown.
   */
  _updateCalculation = function (calculation, data) {
    if (data.error !== undefined) {
      throw new Error(data.error +
          ' Must specify design_code, site_class, risk_category' +
          'latitude, longitude, and title; to retrive usdesign data.');
    }
    else {
      calculation.set(data);
    }
    return calculation;
  };

  _buildUrl = function(calculation) {
    var url,
        input;

    input = calculation.get('input');
    url = _url + '/' +
        input.get('design_code') + '/' +
        input.get('site_class') + '/' +
        input.get('risk_category') + '/' +
        input.get('latitude') + '/' +
        input.get('longitude') + '/' +
        input.get('title');
    return url;
  };

_initialize(params);
params = null;
return _this;
};

module.exports = WebServiceAccessor;
