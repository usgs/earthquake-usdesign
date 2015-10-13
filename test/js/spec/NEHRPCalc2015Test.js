/* global after, before, chai, describe, it */
'use strict';

var NEHRPCalc2015 = require('NEHRPCalc2015'),
    Calculation = require('Calculation'),
    LookupDataFactory = require('util/LookupDataFactory'),

    la = require('etc/la'),
    socal = require('etc/socal');


var expect = chai.expect;
var EPSILION = 0.00001;

var calculate = Calculation(la);

/**
 *  This calculation is needed to test S1D which requires a different
 *  deterministic floor value, location, etc.
 */
var calculate2 = Calculation(socal);

var calc = NEHRPCalc2015();

describe('NEHRPCalc2015Test', function () {
  var calculator,
      factory;

  before(function (done) {
    factory = LookupDataFactory();
    factory.whenReady(function () {
      calculator = NEHRPCalc2015({lookupDataFactory: factory});
      done();
    });
  });
  after(function () {
    calculator.destroy();
    factory.destroy();
  });
  describe('Constructor', function () {
    it('is defined', function () {
      expect(NEHRPCalc2015).to.not.equal(null);
    });
  });

  describe('Calculations', function () {
    //var calc = NEHRPCalc2015();

    it('getSsuh is correct', function () {
      expect(calc.getSsuh(calculate)).to.be.closeTo(
          2.1059390000000002, EPSILION);
    });

    it('getS1uh is correct', function () {
      expect(calc.getS1uh(calculate)).to.be.closeTo(0.7432191, EPSILION);
    });


    it('getSsur', function () {
      expect(calc.getSsur(calculate)).to.be.closeTo(
          1.8877426602100003, EPSILION);
    });

    it('getS1ur', function () {
      expect(calc.getS1ur(calculate)).to.be.closeTo(
          0.6687113852250001, EPSILION);
    });

    it('getSsd', function () {
      expect(calc.getSsd(calculate)).to.equal(2.4320191500000004);
    });

    it('getS1d', function () {
      expect(calc.getS1d(calculate2)).to.be.closeTo(0.78596, EPSILION);
    });

    it('getFv', function () {
      expect(calc.getFv(calculate)).to.be.closeTo(1.7, EPSILION);
    });

    it('getSms', function () {
      expect(calc.getSms(calculate)).to.be.closeTo(
          1.8877426602100003, EPSILION);
    });

    it('getSm1', function () {
      expect(calc.getSm1(calculate)).to.be.closeTo(
          1.1368093548825, EPSILION);
    });

    it('getSds', function () {
      expect(calc.getSds(calculate)).to.be.closeTo(
          1.2584951068066668, EPSILION);
    });

    it('getSd1', function () {
      expect(calc.getSd1(calculate)).to.be.closeTo(0.757872903255, EPSILION);
    });

    it('getPga', function () {
      expect(calc.getPga(calculate)).to.be.closeTo(0.819108, EPSILION);
    });

    it('getFpga', function () {
      expect(calc.getFpga(calculate)).to.equal(1.1);
    });

    it('getPgam', function () {
      expect(calc.getPgam(calculate)).to.be.closeTo(
          0.9010188, EPSILION);
    });

    it('getSdSpectra', function () {
      var spectraArray;

      spectraArray = calc.getSdSpectra(calculate);

      expect(spectraArray[0][0]).to.equal(0);
      expect(spectraArray[0][1]).to.be.closeTo(0.5033980427226667, EPSILION);

      expect(spectraArray[1][0]).to.be.closeTo(0.12044113626759241, EPSILION);
      expect(spectraArray[1][1]).to.be.closeTo(1.2584951068066668, EPSILION);

      expect(spectraArray[2][0]).to.be.closeTo(0.602205681337962, EPSILION);
      expect(spectraArray[2][1]).to.be.closeTo(1.2584951068066668, EPSILION);
    });

    it('getSmSpectra', function () {
      var spectraArray;

      spectraArray = calc.getSmSpectra(calculate);

      expect(spectraArray[0][0]).to.equal(0);
      expect(spectraArray[0][1]).to.be.closeTo(0.7550970640840001, EPSILION);

      expect(spectraArray[1][0]).to.be.closeTo(0.1204411362675924, EPSILION);
      expect(spectraArray[1][1]).to.be.closeTo(1.8877426602100003, EPSILION);

      expect(spectraArray[2][0]).to.be.closeTo(0.6022056813379619, EPSILION);
      expect(spectraArray[2][1]).to.be.closeTo(1.8877426602100003, EPSILION);
    });

    it('getSiteClass', function () {
      expect(calc.getSiteClass(calculate).get('value')).to.equal('D');
    });

    it('getSs', function () {
      expect(calc.getSs(calculate)).to.be.closeTo(
          1.8877426602100003, EPSILION);
    });

    it('getS1', function () {
      expect(calc.getS1(calculate)).to.be.closeTo(
          0.6687113852250001, EPSILION);
    });

    it('getSds', function () {
      expect(calc.getSds(calculate)).to.be.closeTo(
          1.2584951068066668, EPSILION);
    });

    it('getSd1', function () {
      expect(calc.getSd1(calculate)).to.be.closeTo(
          0.757872903255, EPSILION);
    });
  });

  describe('interpolates correctly', function () {
    // var calc;

    // calc = NEHRPCalc2015();

    it('interpolateValue is correct when interpolation_method is not linearlog',
        function () {
      expect(calc.interpolateValue(0, 2, 1/2, 0, 1)).to.equal(1);
    });

    it('interpolateValue is correct when interpolation_method is equal to' +
        'linearlog',
        function () {
      expect(calc.interpolateValue(3, 2, 1/2, 0, 1, 'linearlog')).to.be.closeTo(
          2.4494897427, EPSILION);
    });

    it('interpolateValue throws error when a y value is 0', function () {
      var throwError;

      throwError = function () {
        calc.interpolateValue(0, 2, 1/2, 0, 1, 'linearlog');
      };

      expect(throwError).to.throw(Error);
    });

    it('interpolates one point correctly', function () {
      var interpolate;

      interpolate = calc.interpolate(calculate);

      expect(JSON.stringify(interpolate)).to.equal(
          JSON.stringify({
            'latitude': 34,
            'longitude': -118,
            'mapped_ss': 1.91449,
            'mapped_s1': 0.571707,
            'mapped_pga': 0.819108,
            'crs': 0.89639,
            'cr1': 0.89975,
            'geomean_ssd': 1.2282925,
            'geomean_s1d': 0.4117471,
            'geomean_pgad': 0.5670918
          })
      );
    });

    it('interpolates two points correctly', function () {
      var calculateTwoPoints,
          interpolate;

      calculateTwoPoints = Calculation({
        'input': {
          'latitude': 34.4,
          'longitude': -180,
        },
        'output': {
          'metadata': {
            'interpolation_method': 'linearlog'
          },
          'data': [
            {
              'latitude': 34,
              'longitude': -180,
              'mapped_ss': 10
            },
            {
              'latitude': 35,
              'longitude': -180,
              'mapped_ss': 20
            }
          ]
        }
      });

      interpolate = calc.interpolate(calculateTwoPoints);

      expect(interpolate.get('latitude')).to.be.closeTo(34.396524915060375,
          EPSILION);

      expect(interpolate.get('mapped_ss')).to.be.closeTo(13.195079107728928,
          EPSILION);
    });

    it('interpolates four points correctly', function () {
      var calculateFourPoints,
          interpolate;

      calculateFourPoints = Calculation({
        'input': {
          'latitude': 34.4,
          'longitude': -174,
        },
        'output': {
          'metadata': {
            'interpolation_method': 'linearlog'
          },
          'data': [
            {
              'latitude': 34,
              'longitude': -180,
              'mapped_ss': 10
            },
            {
              'latitude': 34,
              'longitude': -170,
              'mapped_ss': 20
            },
            {
              'latitude': 35,
              'longitude': -180,
              'mapped_ss': 20
            },
            {
              'latitude': 35,
              'longitude': -170,
              'mapped_ss': 10
            }
          ]
        }
      });

      interpolate = calc.interpolate(calculateFourPoints);

      expect(interpolate.get('latitude')).to.be.closeTo(34.396524915060375,
          EPSILION);

      expect(interpolate.get('mapped_ss')).to.be.closeTo(14.339552480158279,
          EPSILION);
    });
  });
});
