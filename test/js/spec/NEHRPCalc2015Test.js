/* global chai, describe, it */
'use strict';

var NEHRPCalc2015 = require('NEHRPCalc2015'),
    Calculation = require('Calculation');


var expect = chai.expect;

var calculation = Calculation({
  'input': {
    'title': 'Los Angeles, CA',
    'latitude': 34,
    'longitude': -118,
    'design_code': '',
    'risk_category': '',
    'site_class': 'D'
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
        'longitude': -118,

        'mapped_ss': 1.95418,
        'crs': 0.89627,
        'geomean_ssd': 1.03,

        'mapped_s1': 0.59832,
        'cr1': 0.89985,
        'geomean_s1d': 0.44,

        'mapped_pga': 0.8936,
        'geomean_pgad': 0.5666
      }
    ]
  }
});

describe('NEHRPCalc2015Test', function () {
  describe('Constructor', function () {
    it('is defined', function () {
      expect(NEHRPCalc2015).to.not.equal(null);
    });
  });

  var calculator = new NEHRPCalc2015();

  describe('calculate', function () {
    it('has results', function () {
      var result = calculator.calculate(calculation);

      expect(result).to.equal('this');
    });
  });
});