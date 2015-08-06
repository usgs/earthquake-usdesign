'use strict';

var socal = {
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
};

module.exports = socal;
