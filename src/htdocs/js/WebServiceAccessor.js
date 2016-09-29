'use strict';

var Calculation = require('Calculation'),

    ModalView = require('mvc/ModalView'),
    Model = require('mvc/Model'),

    Xhr = require('util/Xhr');

var _DEFAULTS = {
  url: 'service/'
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
   * @param errback {function}
   *          Callback function in case there are errors.
   * @return: {Calculation}
   *          Calculation Model filled with the input/output data.
   */
  _this.getResults = function (calculation, callback, errback) {
    Xhr.ajax({
        url: _buildUrl(calculation),
        success: function(data) {
          var status;

          try {
            status = calculation.get('status');

            if (status === Calculation.STATUS_SENT) {
              _updateCalculation(calculation, data);
            }

            if (callback) {
              callback(calculation);
            }
          } catch (e) {
            if (errback) {
              errback(e);
            }
          }
        },
        error: errback
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
    var clearResult,
        errorMessage,
        field,
        input,
        metadata,
        output,
        result;

    if (data.error !== undefined || data.output.data.length === 0) {
      calculation.set({
        status: Calculation.STATUS_INVALID
      });

      errorMessage = data.error ? data.error :
          'Server failed to return results. Check your inputs and try again.';

      ModalView('<p>' + errorMessage + '</p>', {
        classes: ['modal-error'],
        title: 'Server Error'
      }).show();

      throw new Error('Server error: ' + errorMessage);
    } else {
      input = calculation.get('input');
      output = calculation.get('output');
      result = calculation.get('result');

      metadata = output.get('metadata');

      input.set(data.input);
      metadata.set(data.output.metadata);
      output.get('data').reset(data.output.data.map(Model));
      output.set({tl: data.output.tl});

      // Clear results so they are recalculated
      clearResult = result.get();
      for (field in clearResult) {
        if (clearResult.hasOwnProperty(field)) {
          clearResult[field] = null;
        }
      }
      result.set(clearResult);

      calculation.set({
        mode: Calculation.MODE_OUTPUT,
        status: Calculation.STATUS_COMPLETE
      });
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
        input.get('longitude') + '/' +
        input.get('latitude') + '/' +
        input.get('title');
    return url;
  };

_initialize(params);
params = null;
return _this;
};

module.exports = WebServiceAccessor;
