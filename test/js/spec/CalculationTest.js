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

    it('has models/collections as appropriate', function () {
      var c,
          data,
          input,
          metadata,
          output;

      c = Calculation();

      input = c.get('input');
      expect(input).to.respondTo('get');
      expect(input).to.respondTo('set');

      output = c.get('output');
      expect(output).to.respondTo('get');
      expect(output).to.respondTo('set');

      metadata = output.get('metadata');
      expect(metadata).to.respondTo('get');
      expect(metadata).to.respondTo('set');

      data = output.get('data');
      expect(data).to.respondTo('get');
      expect(data).to.respondTo('reset');
    });
  });
});
