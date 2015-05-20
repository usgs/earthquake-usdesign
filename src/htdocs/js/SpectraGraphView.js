'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');


/**
 * Display a graph of x/y coordinates.
 *
 * @param options.data {Array<Array>}
 *        coordinates to display.
 */
var SpectraGraphView = function (options) {
  var _this,
      _initialize,
      // variables
      _data;

  _this = View(options);

  /**
   * Initialize view.
   */
  _initialize = function (options) {
    var el;

    _data = options.data;

    el = _this.el;
    el.innerHTML = 'I am a SpectraGraphView';
  };

  /**
   * Destroy view.
   */
  _this.destroy = Util.compose(function () {
    _data = null;
  }, _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = SpectraGraphView;
