/* global chai, describe, it */
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

});
