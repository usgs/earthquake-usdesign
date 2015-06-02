/* global afterEach, beforeEach, chai, describe, it, sinon */
'use strict';

var LookupDataFactory = require('util/LookupDataFactory'),

    Xhr = require('util/Xhr');


var expect = chai.expect;

describe('LookupDataFactory', function () {
  var ajaxStub;

  beforeEach(function () {
    ajaxStub = sinon.stub(Xhr, 'ajax', function (options) {
      options.success({
        hazard_basis: [],
        design_code: [],
        region: [],
        site_class: [],
        risk_category: []
      });
    });
  });

  afterEach(function () {
    ajaxStub.restore();
  });

  describe('constructor', function () {
    it('can be required without blowing up', function () {
      /* jshint -W030 */
      expect(true).to.equal(true);
      /* jshint +W030 */
    });

    it('can be instantiated without blowing up', function () {
      var create = function () {
        LookupDataFactory();
      };

      expect(create).to.not.throw(Error);
    });
  });

  describe('whenReady', function () {
    it('calls all callbacks', function (done) {
      var checkDone,
          f1,
          f2,
          f3,
          factory;


      f1 = sinon.spy(function () {checkDone();});
      f2 = sinon.spy(function () {checkDone();});
      f3 = sinon.spy(function () {checkDone();});

      checkDone = function () {
        if (f1.calledOnce && f2.calledOnce && f3.calledOnce) {
          done();
        }
      };

      factory = LookupDataFactory();


      factory.whenReady(f1);
      factory.whenReady(f2);
      factory.whenReady(f3);
    });
  });
});
