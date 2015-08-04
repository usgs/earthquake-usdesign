/* global after, before, chai, describe, it */
'use strict';

var NEHRPCalc2015 = require('NEHRPCalc2015'),
    Calculation = require('Calculation'),
    LookupDataFactory = require('util/LookupDataFactory');


var expect = chai.expect;
var EPSILION = 0.00001;

var calculate = Calculation({
  'input': {
    'title': 'Los Angeles, CA',
    'latitude': 34,
    'longitude': -118,
    'design_code': 1,
    'risk_category': 1,
    'site_class': 4
  },
  'output': {
    'metadata': {
      'max_direction_ss': 1.1,
      'max_direction_s1': 1.3,
      'percentile_ss': 1.8,
      'percentile_s1': 1.8,
      'deterministic_floor_ss': 1.5,
      'deterministic_floor_s1': 0.6,
      'deterministic_floor_pga': 0.5,
      'grid_spacing': null,
      'interpolation_method': 'linearlog'
    },
    'tl': null,
    'data': [
      {
        'latitude': 34,
        'longitude': -90.0,

        'mapped_ss': 0.363,
        'crs': 0.87379,
        'geomean_ssd': 0.381840,

        'mapped_s1': 0.141,
        'cr1': 0.8569,
        'geomean_s1d': 0.113360,

        'mapped_pga': 0.180,
        'geomean_pgad': 0.206040
      }
    ]
  }
});

/**
 *  This calculation is needed to test S1D which requires a different
 *  deterministic floor value, location, etc.
 */
var calculate2 = Calculation({
  'input': {
    'title': 'null',
    'latitude': 34.05,
    'longitude': -118.25,
    'design_code': 1,
    'risk_category': 1,
    'site_class': 4
  },
  'output': {
  'data': [
    {
      'latitude': 34.05,
      'longitude': -118.25,
      'mapped_ss': 1.99347,
      'mapped_s1': 0.600917,
      'mapped_pga': 0.843573,
      'crs': 0.89834,
      'cr1': 0.89758,
      'geomean_ssd': 1.246042,
      'geomean_s1d': 0.3358812,
      'geomean_pgad': 0.5543649
    }
  ],
  'metadata': {
    'region_name': 'Conterminous US',
    'region_id': 6,
    'max_direction_ss': 1.1,
    'max_direction_s1': 1.3,
    'percentile_ss': 1.8,
    'percentile_s1': 1.8,
    'percentile_pga': 1.8,
    'deterministic_floor_ss': 1.5,
    'deterministic_floor_s1': 0.6,
    'deterministic_floor_pga': 0.5,
    'grid_spacing': 0.05
  },
  'tl': null
}
});

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
          0.39930000000000004, EPSILION);
    });

    it('getS1uh is correct', function () {
      expect(calc.getS1uh(calculate)).to.be.closeTo(0.1833, EPSILION);
    });


    it('getSsur', function () {
      expect(calc.getSsur(calculate)).to.be.closeTo(0.3489043, EPSILION);
    });

    it('getS1ur', function () {
      expect(calc.getS1ur(calculate)).to.be.closeTo(0.15706, EPSILION);
    });

    it('getSsd', function () {
      expect(calc.getSsd(calculate)).to.equal(1.5);
    });

    it('getS1d', function () {
      expect(calc.getS1d(calculate2)).to.be.closeTo(0.78596, EPSILION);
    });

    it('getFv', function () {
      expect(calc.getFv(calculate)).to.be.closeTo(2.28586, EPSILION);
    });

    it('getSms', function () {
      expect(calc.getSms(calculate)).to.be.closeTo(0.53064, EPSILION);
    });

    it('getSm1', function () {
      expect(calc.getSm1(calculate)).to.be.closeTo(0.3590395, EPSILION);
    });

    it('getSds', function () {
      expect(calc.getSds(calculate)).to.be.closeTo(0.3537602, EPSILION);
    });

    it('getSd1', function () {
      expect(calc.getSd1(calculate)).to.be.closeTo(0.239359, EPSILION);
    });

    it('getPga', function () {
      expect(calc.getPga(calculate)).to.equal(0.18);
    });

    it('getFpga', function () {
      expect(calc.getFpga(calculate)).to.equal(1.44);
    });

    it('getPgam', function () {
      expect(calc.getPgam(calculate)).to.equal(0.2592);
    });

    it('getSdSpectra', function () {
      var spectraArray;

      spectraArray = calc.getSdSpectra(calculate);

      expect(spectraArray[0][0]).to.equal(0);
      expect(spectraArray[0][1]).to.be.closeTo(0.14150411, EPSILION);

      expect(spectraArray[1][0]).to.be.closeTo(0.13532311, EPSILION);
      expect(spectraArray[1][1]).to.be.closeTo(0.35376028, EPSILION);

      expect(spectraArray[2][0]).to.be.closeTo(0.67661556, EPSILION);
      expect(spectraArray[2][1]).to.be.closeTo(0.35376028, EPSILION);
    });

    it('getSmSpectra', function () {
      var spectraArray;

      spectraArray = calc.getSmSpectra(calculate);

      expect(spectraArray[0][0]).to.equal(0);
      expect(spectraArray[0][1]).to.be.closeTo(0.212256171, EPSILION);

      expect(spectraArray[1][0]).to.be.closeTo(0.135323113, EPSILION);
      expect(spectraArray[1][1]).to.be.closeTo(0.530640429, EPSILION);

      expect(spectraArray[2][0]).to.be.closeTo(0.676615569, EPSILION);
      expect(spectraArray[2][1]).to.be.closeTo(0.530640429, EPSILION);
    });

    it('getSiteClass', function () {
      expect(calc.getSiteClass(calculate).get('value')).to.equal('D');
    });

    it('getSs', function () {
      expect(calc.getSs(calculate)).to.be.closeTo(0.348904347, EPSILION);
    });

    it('getS1', function () {
      expect(calc.getS1(calculate)).to.be.closeTo(0.15706977, EPSILION);
    });

    it('getSds', function () {
      expect(calc.getSds(calculate)).to.be.closeTo(0.35376, EPSILION);
    });

    it('getSd1', function () {
      expect(calc.getSd1(calculate)).to.be.closeTo(0.23935972, EPSILION);
    });

    it('getPga', function () {
      expect(calc.getPga(calculate)).to.equal(0.18);
    });

    it('getPgam', function () {
      expect(calc.getPgam(calculate)).to.be.closeTo(0.25920, EPSILION);
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
            'longitude': -90.0,

            'mapped_ss': 0.363,
            'crs': 0.87379,
            'geomean_ssd': 0.381840,

            'mapped_s1': 0.141,
            'cr1': 0.8569,
            'geomean_s1d': 0.113360,

            'mapped_pga': 0.180,
            'geomean_pgad': 0.206040
          })
      );
    });

    it('interpolates two points correctly', function () {
      var calculateTwoPoints,
          interpolate;

      calculateTwoPoints = Calculation({
        'input': {
          'latitude': 34.4,
          'longitude': -118,
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

      expect(JSON.stringify(interpolate)).to.equal(
          JSON.stringify({
            'latitude': 34.4,
            'longitude': -180,
            'mapped_ss': 13.999999999999986
          })
      );
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

      expect(JSON.stringify(interpolate)).to.equal(
          JSON.stringify({
            'latitude': 34,
            'longitude': -174,
            'mapped_ss': 16
          })
      );
    });
  });
});
