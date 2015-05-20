'use strict';

var d3 = require('d3'),
    D3GraphView = require('util/D3GraphView'),
    Util = require('util/Util');


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
      _data,
      _line,
      _spectra,
      _x,
      _y,
      // methods
      _getX,
      _getY;

  _this = D3GraphView(options);

  /**
   * Initialize view.
   */
  _initialize = function (options) {
    var el = d3.select(_this.dataEl),
        toset;

    _this.el.classList.add('SpectraGraphView');

    _spectra = el.append('path')
        .attr('class', 'spectra')
        .attr('clip-path', 'url(#plotAreaClip)');

    _line = d3.svg.line()
        .x(_getX)
        .y(_getY);

    toset = {};
    if (!options.hasOwnProperty('xAxisLabel')) {
      toset.xAxisLabel = 'Period, T (sec)';
    }
    if (!options.hasOwnProperty('yAxisLabel')) {
      toset.yAxisLabel = 'Sa (g)';
    }
    _this.model.set(toset, {silent: true});
  };


  /**
   * Get the x coordinate of a data point.
   *
   * @param d {Number}
   *        index of point.
   * @return {Number}
   *         pixel x value.
   */
  _getX = function (d) {
    return _x(d[0]);
  };

  /**
   * Get the y coordinate of a data point.
   *
   * @param d {Number}
   *        index of point.
   * @return {Number}
   *         pixel y value.
   */
  _getY = function (d) {
    return _y(d[1]);
  };

  /**
   * Destroy view.
   */
  _this.destroy = Util.compose(function () {
    _data = null;
  }, _this.destroy);


  /**
   * Get x axis extent.
   */
  _this.getXExtent = function () {
    var xExtent = _this.model.get('xExtent');
    if (xExtent === null) {
      _data = _this.model.get('data');
      xExtent = d3.extent(_data, function (d) { return d[0]; });
    }
    return xExtent;
  };

  /**
   * Get y axis extent.
   *
   * @param xExtent {Array<Number>}
   *        current x extent.
   * @return {Array<Number>}
   *         y extent.
   */
  _this.getYExtent = function (/*xExtent*/) {
    var yExtent = _this.model.get('yExtent');
    if (yExtent === null) {
      _data = _this.model.get('data');
      yExtent = d3.extent(_data, function (d) { return d[1]; });
    }
    return yExtent;
  };

  _this.plot = function () {
    var options = _this.model.get();

    _data = options.data;
    _x = options.xAxisScale;
    _y = options.yAxisScale;

    _spectra.attr('d', _line(_data));
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = SpectraGraphView;
