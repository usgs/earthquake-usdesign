/* global chai, describe, it */
'use strict';

var ExampleModule = require('ExampleModule');

var expect = chai.expect;

describe('Example test suite', function () {
  describe('_initialize', function () {
    it('can be created and destroyed', function () {
      var createAndDestroy = function () {
        var example = ExampleModule();
        example.destroy();
      };

      expect(createAndDestroy).to.not.throw(Error);
    });
  });
});
