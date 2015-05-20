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
      _annotationLines,
      _annotations,
      _data,
      _line,
      _s1,
      _spectra,
      _ss,
      _t0,
      _ts,
      _x,
      _y,
      // methods
      _formatSsS1Values,
      _formatXAxis,
      _formatYAxis,
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

    _annotations = el.append('g')
        .attr('class', 'annotations')
        .attr('clip-path', 'url(#plotAreaClip)');
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
   *
   */
  _formatSsS1Values = function () {
    var d,
        i,
        x,
        y;

    _annotationLines = [];

    if (_ss !== null && _s1 !== null) {
      // find ss x extents
      _t0 = null;
      _ts = null;
      for (i = 0; i < _data.length; i++) {
        d = _data[i];
        y = d[1];
        if (y === _ss) {
          x = d[0];
          if (_t0 === null || x < _t0) {
            // t0 is minimum x value where y === ss
            _t0 = x;
          }
          if (_ts === null || x > _ts) {
            // ts is maximum x value where y === ss
            _ts = x;
          }
        }
      }

      // t0, ts lines parallel to y axis
      _annotationLines.push([[_t0, 0], [_t0, _ss]]);
      _annotationLines.push([[_ts, 0], [_ts, _ss]]);
      // ss line parallel to x axis
      _annotationLines.push([[0, _ss], [_ts, _ss]]);
      // t1 line parallel to y axis
      _annotationLines.push([[1, 0], [1, _s1]]);
      // s1 line parllel to x axis
      _annotationLines.push([[0, _s1], [1, _s1]]);

      // use custom axis formats
      _this.model.set({
        paddingLeft: 140,
        xAxisFormat: _formatXAxis,
        xAxisTicks: [_t0, _ts, 1],
        yAxisFormat: _formatYAxis,
        yAxisTicks: [_s1, _ss]
      }, {silent: true});
    } else {
      // use default axis formats
      _this.model.set({
        paddingLeft: 75,
        xAxisFormat: null,
        xAxisTicks: null,
        yAxisFormat: null,
        yAxisTicks: null
      }, {silent: true});
    }
  };

  /**
   * Custom format function for x axis, used for detail.
   *
   * @param x {Number}
   *        x tick value, one of _t0, _ts, or 1.
   * @return {String}
   *         formatted tick value.
   */
  _formatXAxis = function (x) {
    if (x === _t0) {
      return 'T0 = ' + _t0;
    } else if (x === _ts) {
      return 'TS = ' + _ts;
    } else if (x === 1) {
      return '1.000';
    } else {
      return x;
    }
  };

  /**
   * Custom format function for y axis, used for detail.
   *
   * @param y {Number}
   *        y tick value, one of _s1 or _ss.
   * @return {String}
   *         formatted tick value.
   */
  _formatYAxis = function (y) {
    if (y === _ss) {
      return 'SS = ' + _ss;
    } else if (y === _s1) {
      return 'S1 = ' + _s1;
    } else {
      return y;
    }
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

  /**
   * Plot spectra response and annotations.
   */
  _this.plot = function () {
    var annotations;

    _spectra.attr('d', _line(_data));

    annotations = _annotations.selectAll('line')
        .data(_annotationLines);
    annotations.enter()
        .append('path');
    annotations.attr('d', _line);
    annotations.exit()
        .remove();
  };

  /**
   * Prepare data to render before parent class updates axes.
   */
  _this.render = Util.compose(function (changed) {
    var options = _this.model.get();

    _data = options.data;
    _x = options.xAxisScale;
    _y = options.yAxisScale;
    _ss = options.ss || null;
    _s1 = options.s1 || null;
    _formatSsS1Values();

    // return value is passed to parent render
    return changed;
  }, _this.render);

  _initialize(options);
  options = null;
  return _this;
};


module.exports = SpectraGraphView;
