/* drop table statements for schema */

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

/* Indexes */
DROP INDEX IF EXISTS data_location_index;

/* Tables */
DROP TABLE IF EXISTS tl;
DROP TABLE IF EXISTS data;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS metadata;
DROP TABLE IF EXISTS design_code_site_class;
DROP TABLE IF EXISTS site_class;
DROP TABLE IF EXISTS design_code_risk_category;
DROP TABLE IF EXISTS risk_category;
DROP TABLE IF EXISTS design_code;
DROP TABLE IF EXISTS hazard_basis;
