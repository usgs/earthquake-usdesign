/* global after, before, chai, describe, it */
'use strict';

var NEHRPCalc2015 = require('NEHRPCalc2015'),
    Calculation = require('Calculation'),
    LookupDataFactory = require('util/LookupDataFactory');


var expect = chai.expect;
var EPSILISON = 0.00001;

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
      'deterministic_floor_pga':0.5,
      'grid_spacing': null
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

// var result =  {
//   'title': 'Los Angeles, CA',
//   'latitude': 34,
//   'longitude': -118,
//   'design_code': 1,
//   'risk_category': 1,
//   'site_class': 4,
//   'tl': null,
//   'mapped_ss': 0.363,
//   'crs': 0.87379,
//   'geomean_ssd': 0.381840,
//   'mapped_s1': 0.141,
//   'cr1': 0.8569,
//   'geomean_s1d': 0.113360,
//   'mapped_pga': 0.180,
//   'geomean_pgad': 0.206040
// };

// result = Model(result);



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
    var calc = NEHRPCalc2015();

    it('interpolateValue is correct', function () {
      expect(calc.interpolateValue(0, 2, 1/2, 0, 1)).to.equal(1);
    });

    it('getSsuh is correct', function () {
      expect(calc.getSsuh(calculate)).to.be.closeTo(0.39930000000000004, EPSILISON);
    });

    it('getS1uh is correct', function () {
      expect(calc.getS1uh(calculate)).to.be.closeTo(0.1833, EPSILISON);
    });

    it('getSsd', function () {
      expect(calc.getSsd(calculate)).to.equal(1.5);
    });

    it('getS1d', function () {
      expect(calc.getS1d(calculate)).to.equal(0.6);
    });

    it('getSs', function () {
      expect(calc.getSs(calculate)).to.be.closeTo(0.348904347, EPSILISON);
    });

    it('getS1', function () {
      expect(calc.getS1(calculate)).to.be.closeTo(0.15706977, EPSILISON);
    });

    it('getSds', function () {
      expect(calc.getSds(calculate)).to.be.closeTo(0.35376, EPSILISON);
    });

    it('getSd1', function () {
      expect(calc.getSd1(calculate)).to.be.closeTo(0.23935972, EPSILISON);
    });

    it('getPga', function () {
      expect(calc.getPga(calculate)).to.equal(0.18);
    });

    it('getPgam', function () {
      expect(calc.getPgam(calculate)).to.be.closeTo(0.25920, EPSILISON);
    });

  });
});