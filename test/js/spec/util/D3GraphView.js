/* global afterEach, beforeEach, chai, describe, it */
'use strict';

var D3GraphView = require('util/D3GraphView'),
    Model = require('mvc/Model');

var expect = chai.expect;

describe('D3GraphView', function () {
  var view;

  beforeEach(function () {
    view = D3GraphView({
      data: Model({
        x: [1, 2, 3],
        y: [3, 2, 1]
      }),
      xExtent: [1, 3],
      yExtent: [1, 3]
    });
  });

  afterEach(function () {
    view.destroy();
    view = null;
  });

  describe('Constructor', function () {
    it('is defined', function () {
      expect(D3GraphView).to.not.equal(null);
    });
  });

  describe('model', function () {
    it('change triggers render()', function () {
      var renderCallCount;

      renderCallCount = 0;
      view.render = function () {
        renderCallCount++;
      };
      view.model.set({
        xExtent: [0, 3]
      });
      expect(renderCallCount).to.equal(1);
    });
  });

  describe('render()', function () {
    it('calls plot()', function () {
      var plotCallCount;

      plotCallCount = 0;
      view.plot = function () {
        plotCallCount++;
      };
      view.render();

      expect(plotCallCount).to.equal(1);
    });

    it('uses custom tick callback when configured', function () {
      var xAxisTicks,
          xAxisTicksCallCount,
          yAxisTicks,
          yAxisTicksCallCount;

      xAxisTicksCallCount = 0;
      xAxisTicks = function (xExtent) {
        xAxisTicksCallCount++;
        return xExtent;
      };

      yAxisTicksCallCount = 0;
      yAxisTicks = function (yExtent) {
        yAxisTicksCallCount++;
        return yExtent;
      };

      view.model.set({
        xAxisTicks: xAxisTicks,
        yAxisTicks: yAxisTicks
      });

      expect(xAxisTicksCallCount).to.equal(1);
      expect(yAxisTicksCallCount).to.equal(1);
    });

    it('uses custom tick format when configured', function () {
      var xAxisFormat,
          xAxisFormatCallCount,
          yAxisFormat,
          yAxisFormatCallCount;

      xAxisFormatCallCount = 0;
      xAxisFormat = function (xExtent) {
        xAxisFormatCallCount++;
        return xExtent;
      };

      yAxisFormatCallCount = 0;
      yAxisFormat = function (yExtent) {
        yAxisFormatCallCount++;
        return yExtent;
      };

      view.model.set({
        xAxisFormat: xAxisFormat,
        xAxisTicks: [1, 1.5, 2, 2.5],
        yAxisFormat: yAxisFormat,
        yAxisTicks: [2, 2.5, 3, 3.5, 4]
      });

      expect(xAxisFormatCallCount).to.equal(4);
      expect(yAxisFormatCallCount).to.equal(5);
    });
  });
});
