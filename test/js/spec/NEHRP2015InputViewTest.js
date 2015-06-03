/* global chai, describe, it */
'use strict';

var Calculation = require('Calculation'),
    NEHRP2015InputView = require('NEHRP2015InputView');

var expect = chai.expect;

describe('NEHRP2015InputView', function () {
  describe('Constructor', function () {
    it('can be required', function () {
      expect(true).to.equal(true);
    });

    it('can be instantiated', function () {
      var constructor = function () {
        NEHRP2015InputView();
      };

      expect(constructor).to.not.throw(Error);
    });

    it('responds to the appropriate methods', function () {
      var view = NEHRP2015InputView({
        model: Calculation()
      });

      expect(view).to.respondTo('render');
      expect(view).to.respondTo('destroy');
    });
  });
});
