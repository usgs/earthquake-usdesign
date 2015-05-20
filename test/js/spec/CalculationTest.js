/* global chai, describe, it */
'use strict';

var Calculation = require('Calculation');

var expect = chai.expect;


describe('Calculation', function () {
  describe('constructor', function () {
    it('can be defined without blowing up', function () {
      expect(true).to.equal(true);
    });

    it('can be instantiated without blowing up', function () {
      var create = function () {
        Calculation();
      };

      expect(create).not.to.throw(Error);
    });

    it('has an id value by default', function () {
      var c = Calculation();

      /* jshint -W030 */
      expect(c.get('id')).to.not.be.null;
      /* jshint +W030 */
    });

    it('honors the given id', function () {
      var c = Calculation({id: 1});

      expect(c.get('id')).to.equal(1);
    });
  });
});
