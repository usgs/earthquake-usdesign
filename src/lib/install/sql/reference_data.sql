-- Hazard basis reference data
INSERT INTO hazard_basis (
  id, name, display_order
) VALUES
  (1, 'USGS hazard data available in 2014', 1);

-- Design code reference data
INSERT INTO design_code (
  id,
  hazard_basis_id,
  name,
  display_order
) VALUES
  (1, 1, '2015 NEHRP', 1);

-- Metadata reference data
INSERT INTO metadata (
  id,
  max_direction_ss, max_direction_s1,
  percentile_ss, percentile_s1, percentile_pga,
  deterministic_floor_ss, deterministic_floor_s1, deterministic_floor_pga,
  interpolation_method
) VALUES
  -- NEHRP 2015 default
  (
    1,
    1.1, 1.3,
    1.8, 1.8, 1.8,
    1.5, 0.6, 0.5,
    'linear'
  ),
  -- NEHRP 2015 American Samoa, Guam, Conterminous US
  (
    2,
    1.1, 1.3,
    1.8, 1.8, 1.8,
    1.5, 0.6, 0.5,
    'linearlog'
  ),
  -- NEHRP 2015 Hawaii
  (
    3,
    1.0, 1.0,
    1.8, 1.8, 1.8,
    1.5, 0.6, 0.5,
    'linear'
  );

-- Region reference data (added by gridded_data.php)

-- Site class reference data
INSERT INTO site_class (
  id, value,
  name, display_order
) VALUES
  (1, 'A', 'Hard Rock', 1),
  (2, 'B', 'Rock', 2),
  (3, 'C', 'Very Dense Soil and Soft Rock', 3),
  (4, 'D', 'Stiff Soil', 4),
  (5, 'E', 'Soft Clay Soil', 5),
  (6, 'U', 'Undeterminded', 6);

-- Risk category reference data
INSERT INTO risk_category (
  id, name, display_order
) VALUES
  (1, 'I or II or III', 1),
  (2, 'IV (eg. essential facilities)', 2);


-- Site class-design code relations
INSERT INTO design_code_site_class (
  id, design_code_id, site_class_id
) VALUES
  (1, 1, 1),
  (2, 1, 2),
  (3, 1, 3),
  (4, 1, 4),
  (5, 1, 5),
  (6, 1, 6);

-- Risk category-design code relations
INSERT INTO design_code_risk_category (
  id, design_code_id, risk_category_id
) VALUES
  (1, 1, 1),
  (2, 1, 2);
