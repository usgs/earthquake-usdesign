'use strict';

// Example calculation, with results for a site near Los Angeles
var la = {
  'input': {
    'title': 'Los Angeles, CA',
    'latitude': 34,
    'longitude': -118,
    'design_code': 1,
    'risk_category': 1,
    'site_class': 4
  },
  'output': {
    'data': [
      {
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

module.exports = la;
