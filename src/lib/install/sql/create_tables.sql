/* create table statements for schema */

/* 
 * Tables:
 *  - hazard_basis
 *  - design_code
 *  - risk_category
 *  - design_code_risk_category
 *  - site_class
 *  - design_code_site_class
 *  - metadata
 *  - region
 *  - data
 */

CREATE TABLE hazard_basis (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  display_order INTEGER
);

CREATE TABLE design_code (
  id INTEGER PRIMARY KEY,
  hazard_basis_id INTEGER REFERENCES hazard_basis (id),
  name VARCHAR(255),
  display_order INTEGER
);

CREATE TABLE risk_category (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  display_order INTEGER
);

CREATE TABLE design_code_risk_category (
  id INTEGER PRIMARY KEY,
  design_code_id INTEGER REFERENCES design_code (id),
  risk_category_id INTEGER REFERENCES risk_category (id)
);

CREATE TABLE site_class (
  id INTEGER PRIMARY KEY,
  value VARCHAR(255),
  name VARCHAR(255),
  display_order INTEGER
);

CREATE TABLE design_code_site_class (
  id INTEGER PRIMARY KEY,
  design_code_id INTEGER REFERENCES design_code (id),
  site_class_id INTEGER REFERENCES site_class (id)
);

CREATE TABLE metadata (
  id INTEGER PRIMARY KEY,
  max_direction_ss NUMERIC,
  max_direction_s1 NUMERIC,
  percentile_ss NUMERIC,
  percentile_s1 NUMERIC,
  percentile_pga NUMERIC,
  deterministic_floor_ss NUMERIC,
  deterministic_floor_s1 NUMERIC,
  deterministic_floor_pga NUMERIC
);

CREATE TABLE region (
  id INTEGER PRIMARY KEY,
  design_code_id INTEGER REFERENCES design_code (id),
  metadata_id INTEGER REFERENCES metadata (id),
  name VARCHAR(255),
  min_latitude NUMERIC,
  max_latitude NUMERIC,
  min_longitude NUMERIC,
  max_longitude NUMERIC,
  grid_spacing NUMERIC
);

CREATE TABLE data (
  id INTEGER PRIMARY KEY,
  region_id INTEGER REFERENCES region (id),
  latitude NUMERIC,
  longitude NUMERIC,
  mapped_ss NUMERIC,
  mapped_s1 NUMERIC,
  mapped_pga NUMERIC,
  crs NUMERIC,
  cr1 NUMERIC,
  geomean_ssd NUMERIC,
  geomean_s1d NUMERIC,
  geomean_pga NUMERIC
);

CREATE INDEX data_location_index ON data (region_id, latitude, longitude);
