'use strict';

var d3 = require('d3'),
    D3GraphView = require('util/D3GraphView'),
    Util = require('util/Util');


/**
 * Display a graph of x/y coordinates.
 *
 * @param options {Object}
 *        all options are passed to D3GraphView.
 * @param options.comment {String}
 *        default null.
 *        may include newline ('\n') characters for multiple lines.
 *        may include simple html (no nested elements).
 * @param options.detailPaddingLeft {Number}
 *        default 140.
 *        left padding (room for axis labels) when in "detail" mode.
 * @param options.s1 {Number}
 *        default null.
 *        value of s1.
 *        when s1 and ss are specified, show "detail" mode.
 * @param options.s1Label {String}
 *        default 'S<sub>1</sub>'.
 *        label for s1 value on y axis when in "detail" mode.
 * @param options.ss {Number}
 *        default null.
 *        value of ss.
 *        when s1 and ss are specified, show "detail" mode.
 * @param options.ssLabel {String}
 *        default 'S<sub>S</sub>'.
 *        label for ss value on y axis when in "detail" mode.
 * @param options.summaryPaddingLeft {Number}
 *        default 75.
 *        left padding when in "summary" mode.
 *
 * @see D3GraphView
 */
var SpectraGraphView = function (options) {
  var _this,
      _initialize,
      // variables
      _annotations,
      _comment,
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
      _convertHTML,
      _formatComment,
      _formatXAxis,
      _formatYAxis,
      _getX,
      _getY;

  _this = D3GraphView(Util.extend({
    comment: null,
    detailPaddingLeft: 140,
    paddingTop: 40,
    s1: null,
    s1Label: 'S<sub>1</sub>',
    ss: null,
    ssLabel: 'S<sub>S</sub>',
    summaryPaddingLeft: 75,
    xAxisLabel: 'Period, T (sec)',
    yAxisLabel: 'Spectral Response Acceleration, Sa (g)'
  }, options));

  /**
   * Initialize view.
   */
  _initialize = function (/*options*/) {
    var el = d3.select(_this.dataEl);

    _this.el.classList.add('SpectraGraphView');

    _annotations = el.append('g')
        .attr('class', 'annotations')
        .attr('clip-path', 'url(#plotAreaClip)');
    _comment = el.append('g')
        .attr('class', 'comment')
        .attr('y', 0);
    _spectra = el.append('path')
        .attr('class', 'spectra')
        .attr('clip-path', 'url(#plotAreaClip)');

    _line = d3.svg.line()
        .x(_getX)
        .y(_getY);
  };

  /**
   * Look for and replace html elements with tspan elements in an svg text node.
   *
   * Created <tspan> elements have class "html-" + nodeName.toLowerCase().
   * <sub> and <sup> elements adjust positioning, which cannot reliably be done
   * using css; this may change once baseline-shift has better support.
   *
   * For example:
   *     <text>A<sub>0</sub></text>
   * Becomes:
   *     <text>
   *       <tspan class="html-text">A</tspan>
   *       <tspan class="html-sub" dx="1" dy="5">0</tspan>
   *     </text>
   *
   * @param el {SVG text element}
   *        element to update.
   */
  _convertHTML = function (el) {
    var className,
        div,
        dx,
        dy,
        node,
        nodeName,
        tspan,
        y;

    div = document.createElement('div');
    div.innerHTML = el.text();
    node = div.firstChild;
    el.text('');

    y = 0;
    while (node !== null) {
      // parse current node
      nodeName = node.nodeName;
      className = 'html-' + nodeName.toLowerCase().replace('#', '');
      tspan = el.append('tspan')
          .text(node.textContent)
          .attr('class', className);

      // css can't adjust tspan positioning reliably
      dx = 0;
      dy = 0;
      if (nodeName === 'SUB') {
        dx = 1;
        dy = 5;
      } else if (nodeName === 'SUP') {
        dx = 2;
        dy = -8;
      }
      // nulls to only set when non-zero, to inherit any existing positioning
      tspan.attr('dx', dx || null);
      tspan.attr('dy', (-y + dy) || null);
      // track current y position
      y = dy;

      // move to next node
      node = node.nextSibling;
    }

    node = null;
    div = null;
  };

  /**
   * Format lines for SVG.
   *
   * @param el {D3 element}
   *        container for text.
   * @param lines {Array|null}
   *        lines to render, or null for empty.
   */
   _formatComment = function (el, content) {
    var lines,
        text,
        y;

    el.text('');
    if (content === null) {
      return;
    }

    y = 0;
    lines = content.split('\n');
    lines.forEach(function (line) {
      var bbox;
      text = el.append('text').text(line);
      _convertHTML(text);
      bbox = text.node().getBBox();
      y += bbox.height;
      text.attr('x', 0);
      text.attr('y', y);
    });
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
      return 'T<sub>0</sub> = ' + _t0;
    } else if (x === _ts) {
      return 'T<sub>S</sub> = ' + _ts;
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
      return _this.model.get('ssLabel') + ' = ' + _ss;
    } else if (y === _s1) {
      return _this.model.get('s1Label') + ' = ' + _s1;
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
    _annotations = null;
    _comment = null;
    _data = null;
    _line = null;
    _s1 = null;
    _spectra = null;
    _ss = null;
    _t0 = null;
    _ts = null;
    _x = null;
    _y = null;
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
    var annotations,
        lines;

    // plot spectra
    _spectra.attr('d', _line(_data));

    // annotation lines
    lines = [];
    if (_s1 !== null && _ss !== null) {
      // t0, ts lines parallel to y axis
      lines.push([[_t0, 0], [_t0, _ss]]);
      lines.push([[_ts, 0], [_ts, _ss]]);
      // ss line parallel to x axis
      lines.push([[0, _ss], [_ts, _ss]]);
      // t1 line parallel to y axis
      lines.push([[1, 0], [1, _s1]]);
      // s1 line parllel to x axis
      lines.push([[0, _s1], [1, _s1]]);
    }
    // always do this, in case annotations are removed
    annotations = _annotations.selectAll('line')
        .data(lines);
    annotations.enter()
        .append('path');
    annotations.attr('d', _line);
    annotations.exit()
        .remove();

    // convert tick label HTML to SVG
    d3.select(_this.el).selectAll('.tick text').each(function () {
      // convert d3 each "this" into parameter to _convertHTML.
      _convertHTML(d3.select(this));
    });

    // show comment
    _formatComment(_comment, _this.model.get('comment'));
    // position in top right corner
    _comment.attr('transform', 'translate(' +
        (_this.dataEl.getBBox().width - _comment.node().getBBox().width) +
        ' 0)');
  };

  /**
   * Prepare data to render before parent class updates axes.
   */
  _this.render = Util.compose(function (changed) {
    var d,
        i,
        options,
        x,
        y;

    // update data, axis, ss, s1 values in case they changed
    options = _this.model.get();
    _data = options.data;
    _x = options.xAxisScale;
    _y = options.yAxisScale;
    _ss = options.ss || null;
    _s1 = options.s1 || null;
    _t0 = null;
    _ts = null;

    // calculate t0, ts, and update axis formatting before parent class render
    if (_ss !== null && _s1 !== null) {
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

      // use custom axis formats
      _this.model.set({
        paddingLeft: _this.model.get('detailPaddingLeft'),
        xAxisFormat: _formatXAxis,
        xAxisTicks: [_t0, _ts, 1],
        yAxisFormat: _formatYAxis,
        yAxisTicks: [_s1, _ss]
      }, {silent: true});
    } else {
      // use default axis formats
      _this.model.set({
        paddingLeft: _this.model.get('summaryPaddingLeft'),
        xAxisFormat: null,
        xAxisTicks: null,
        yAxisFormat: null,
        yAxisTicks: null
      }, {silent: true});
    }

    // return value is passed to parent render
    return changed;
  }, _this.render);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = SpectraGraphView;
