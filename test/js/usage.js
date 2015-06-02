'use strict';

/**
 * Static testing data.
 *
 * Generated from usage.ws.php while running a database with reference data.
 * 2015-06-02.
 */
module.exports = {
  'url': 'http://localhost:8511/usdesign/ws/{design_code_id}/{site_class_id}/{risk_category_id}/{longitude}/{latitude}/{title}',
  'hazard_basis': [
    {
      'id': 1,
      'name': 'USGS hazard data available in 2014',
      'display_order': 1,
      'design_code': [
        1
      ]
    }
  ],
  'design_code': [
    {
      'id': 1,
      'name': '2015 NEHRP',
      'display_order': 1,
      'hazard_basis': 1,
      'site_classes': [
        1,
        2,
        3,
        4,
        5
      ],
      'risk_categories': [
        1,
        2
      ],
      'regions': [
        4,
        5,
        6
      ]
    }
  ],
  'region': [
    {
      'id': 4,
      'name': 'American Samoa',
      'min_latitude': -33,
      'max_latitude': -11,
      'min_longitude': -195,
      'max_longitude': -165.1,
      'grid_spacing': 0.1,
      'max_direction_ss': 1.1,
      'max_direction_s1': 1.3,
      'percentile_ss': 1.8,
      'percentile_s1': 1.8,
      'percentile_pga': 1.8,
      'deterministic_floor_ss': 1.5,
      'deterministic_floor_s1': 0.6,
      'deterministic_floor_pga': 0.5
    },
    {
      'id': 5,
      'name': 'Guam',
      'min_latitude': 9,
      'max_latitude': 23,
      'min_longitude': 139,
      'max_longitude': 151,
      'grid_spacing': 0.1,
      'max_direction_ss': 1.1,
      'max_direction_s1': 1.3,
      'percentile_ss': 1.8,
      'percentile_s1': 1.8,
      'percentile_pga': 1.8,
      'deterministic_floor_ss': 1.5,
      'deterministic_floor_s1': 0.6,
      'deterministic_floor_pga': 0.5
    },
    {
      'id': 6,
      'name': 'Puerto Rico and Virgin Islands',
      'min_latitude': 17.5,
      'max_latitude': 19,
      'min_longitude': -67.5,
      'max_longitude': -64.5,
      'grid_spacing': 0.02,
      'max_direction_ss': 1.1,
      'max_direction_s1': 1.3,
      'percentile_ss': 1.8,
      'percentile_s1': 1.8,
      'percentile_pga': 1.8,
      'deterministic_floor_ss': 1.5,
      'deterministic_floor_s1': 0.6,
      'deterministic_floor_pga': 0.5
    }
  ],
  'site_class': [
    {
      'id': 1,
      'name': 'Hard Rock',
      'display_order': 1,
      'value': 'A'
    },
    {
      'id': 2,
      'name': 'Rock',
      'display_order': 2,
      'value': 'B'
    },
    {
      'id': 3,
      'name': 'Very Dense Soil and Soft Rock',
      'display_order': 3,
      'value': 'C'
    },
    {
      'id': 4,
      'name': 'Stiff Soil',
      'display_order': 4,
      'value': 'D'
    },
    {
      'id': 5,
      'name': 'Soft Clay Soil',
      'display_order': 5,
      'value': 'E'
    }
  ],
  'risk_category': [
    {
      'id': 1,
      'name': 'I or II or III',
      'display_order': 1
    },
    {
      'id': 2,
      'name': 'IV (eg. essential facilities)',
      'display_order': 2
    }
  ]
};
