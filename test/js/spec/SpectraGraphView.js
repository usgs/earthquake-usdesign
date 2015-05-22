/* global after, before, chai, describe, it */
'use strict';

var SpectraGraphView = require('SpectraGraphView');

var expect = chai.expect;

describe('SpectraGraphView', function () {

  var testdata = [
    [0, 1.025],
    [0.136, 2.563],
    [0.2, 2.563],
    [0.679, 2.563],
    [0.7, 2.487],
    [0.8, 2.176],
    [0.9, 1.934],
    [1, 1.741],
    [1.1, 1.583],
    [1.2, 1.451],
    [1.3, 1.339],
    [1.4, 1.244],
    [1.5, 1.161],
    [1.6, 1.088],
    [1.7, 1.024],
    [1.8, 0.967],
    [1.9, 0.916],
    [2, 0.87]
  ];


  describe('Constructor', function () {
    it('is defined', function () {
      expect(SpectraGraphView).to.not.equal(null);
    });

    it('can be destroyed', function () {
      var view = SpectraGraphView({
        data: testdata
      });
      view.render();
      view.destroy();
    });
  });

  describe('getXExtent()', function () {
    it('computes extent from data', function () {
      var view = SpectraGraphView({
        data: testdata
      });
      expect(''+view.getXExtent()).to.equal('0,2');
      view.destroy();
    });
  });

  describe('getYExtent()', function () {
    it('computes extent from data', function () {
      var view = SpectraGraphView({
        data: testdata
      });
      expect('' + view.getYExtent()).to.equal('0.87,2.563');
      view.destroy();
    });
  });

  describe('when ss and s1 are set', function () {
    it('shows annotation lines', function () {
      var view = SpectraGraphView({
        data: testdata,
        ss: 2.563,
        s1: 1.741
      });
      view.render();
      expect(view.el.querySelectorAll('.annotations > path').length).to.equal(5);
      view.destroy();
    });
  });

  describe('when comment is set', function () {
    var view;

    before(function () {
      view = SpectraGraphView({
        data: testdata,
        comment: 'this is a comment line\n' +
            'this is a <sup>test sup</sup> with html'
      });
      view.render();
    });

    after(function () {
      view.destroy();
      view = null;
    });

    it('splits on newlines', function () {
      // two lines (one newline char)
      expect(view.el.querySelectorAll('.comment > text').length).to.equal(2);
    });

    it('replaces html with tspan elements', function () {
      // one for first line, three for second line.
      expect(view.el.querySelectorAll('.comment tspan').length).to.equal(4);
      // sup element is replaced with tspan element.
      expect(view.el.querySelector('.comment .html-sup').textContent)
          .to.equal('test sup');
    });
  });

});
