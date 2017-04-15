-- Ignore notices for implicit index/sequence creation.
SET client_min_messages = WARNING;

-- Delete tables in the correct order, removing dependencies first.
DROP VIEW IF EXISTS us_design.risk_table_vw;
DROP VIEW IF EXISTS us_design.f_data_vw;

DROP INDEX IF EXISTS us_design.data_dataset_id_idx;
DROP INDEX IF EXISTS us_design.data_latitude_idx;
DROP INDEX IF EXISTS us_design.data_longitude_idx;
DROP INDEX IF EXISTS us_design.dataset_edition_id_idx;
DROP INDEX IF EXISTS us_design.dataset_region_id_idx;

DROP TABLE IF EXISTS us_design.data;
DROP TABLE IF EXISTS us_design.dataset;
DROP TABLE IF EXISTS us_design.data_group;
DROP TABLE IF EXISTS us_design.region;
DROP TABLE IF EXISTS us_design.f_data;
DROP TABLE IF EXISTS us_design.f_header;
DROP TABLE IF EXISTS us_design.f_table;
DROP TABLE IF EXISTS us_design.edition_site_soil_class;
DROP TABLE IF EXISTS us_design.site_soil_class;
DROP TABLE IF EXISTS us_design.design_code_variant;
DROP TABLE IF EXISTS us_design.risk_data;
DROP TABLE IF EXISTS us_design.risk_header;
DROP TABLE IF EXISTS us_design.risk_interval;
DROP TABLE IF EXISTS us_design.risk_table;
DROP TABLE IF EXISTS us_design.risk_category;
DROP TABLE IF EXISTS us_design.edition;
DROP TABLE IF EXISTS us_design.data_source;

CREATE TABLE us_design.data_source
(
  id bigserial NOT NULL,
  title character varying(100) NOT NULL,
  display_order smallint NOT NULL,
  CONSTRAINT data_source_pk PRIMARY KEY (id)
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.edition
(
  id bigserial NOT NULL,
  code character varying(20) NOT NULL,
  title character varying(100) NOT NULL,
  data_source_id bigint NOT NULL,
  display_order smallint NOT NULL,
  risk_category_label character varying(100),
  CONSTRAINT edition_pk PRIMARY KEY (id),
  CONSTRAINT edition_data_source_id_fk FOREIGN KEY (data_source_id)
      REFERENCES us_design.data_source (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE TABLE risk_category
(
  id bigserial NOT NULL,
  edition_id bigint NOT NULL,
  category character varying(100) NOT NULL,
  display_order smallint NOT NULL,
  CONSTRAINT risk_category_pk PRIMARY KEY (id),
  CONSTRAINT risk_category_edition_id_fk FOREIGN KEY (edition_id)
      REFERENCES us_design.edition (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.risk_table
(
  id bigserial NOT NULL,
  edition_id bigint NOT NULL,
  table_type character varying(5) NOT NULL,
  CONSTRAINT risk_table_pk PRIMARY KEY (id),
  CONSTRAINT risk_table_edition_id_fk FOREIGN KEY (edition_id)
      REFERENCES us_design.edition (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT risk_table_table_type_ck CHECK (table_type::text = ANY (ARRAY['SDS'::character varying::text, 'SD1'::character varying::text]))
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.risk_interval
(
  id bigserial NOT NULL,
  risk_table_id bigint NOT NULL,
  min_s_value double precision,
  max_s_value double precision,
  CONSTRAINT risk_interval_pk PRIMARY KEY (id),
  CONSTRAINT risk_interval_risk_table_id_fk FOREIGN KEY (risk_table_id)
      REFERENCES us_design.risk_table (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.risk_header
(
  id bigserial NOT NULL,
  risk_table_id bigint NOT NULL,
  category_title character varying(100) NOT NULL,
  display_order smallint NOT NULL,
  CONSTRAINT risk_header_pk PRIMARY KEY (id),
  CONSTRAINT risk_header_risk_table_id_fk FOREIGN KEY (risk_table_id)
      REFERENCES us_design.risk_table (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.risk_data
(
  id bigserial NOT NULL,
  risk_header_id bigint NOT NULL,
  risk_interval_id bigint NOT NULL,
  design_category character(1) NOT NULL,
  CONSTRAINT risk_data_pk PRIMARY KEY (id),
  CONSTRAINT risk_data_risk_header_id_fk FOREIGN KEY (risk_header_id)
      REFERENCES us_design.risk_header (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT risk_data_risk_interval_id_fk FOREIGN KEY (risk_interval_id)
      REFERENCES us_design.risk_interval (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.design_code_variant
(
  id bigserial NOT NULL,
  edition_id bigint NOT NULL,
  code character varying(20) NOT NULL,
  requires_exceedence_probability boolean NOT NULL,
  display_order smallint NOT NULL,
  CONSTRAINT design_code_variant_pk PRIMARY KEY (id),
  CONSTRAINT design_code_variant_edition_id_fk FOREIGN KEY (edition_id)
      REFERENCES us_design.edition (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.site_soil_class
(
  id bigserial NOT NULL,
  code character varying,
  title character varying(100) NOT NULL,
  display_order smallint NOT NULL,
  CONSTRAINT site_soil_class_pk PRIMARY KEY (id)
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.edition_site_soil_class
(
  id bigserial NOT NULL,
  edition_id bigint NOT NULL,
  site_soil_class_id bigint NOT NULL,
  CONSTRAINT edition_site_soil_class_pk PRIMARY KEY (id),
  CONSTRAINT edition_site_soil_class_edition_id_fk FOREIGN KEY (edition_id)
      REFERENCES us_design.edition (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT edition_site_soil_class_site_soil_class_id_fk FOREIGN KEY (site_soil_class_id)
      REFERENCES us_design.site_soil_class (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.f_table
(
  id bigserial NOT NULL,
  type character varying(4) NOT NULL,
  CONSTRAINT f_table_pk PRIMARY KEY (id),
  CONSTRAINT f_table_type_ck CHECK (type::text = ANY (ARRAY['fa'::character varying, 'fv'::character varying, 'fpga'::character varying]::text[]))
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.f_header
(
  id bigserial NOT NULL,
  f_table_id bigint NOT NULL,
  value double precision,
  CONSTRAINT f_header_pk PRIMARY KEY (id),
  CONSTRAINT f_header_f_table_id_fk FOREIGN KEY (f_table_id)
      REFERENCES us_design.f_table (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.f_data
(
  id bigserial NOT NULL,
  site_soil_class_id bigint NOT NULL,
  f_header_id bigint NOT NULL,
  value double precision NOT NULL,
  CONSTRAINT f_data_pk PRIMARY KEY (id),
  CONSTRAINT f_data_f_header_id_fk FOREIGN KEY (f_header_id)
      REFERENCES us_design.f_header (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT f_data_site_soil_class_id_fk FOREIGN KEY (site_soil_class_id)
      REFERENCES us_design.site_soil_class (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.region
(
  id bigserial NOT NULL,
  name character varying(100) NOT NULL,
  min_longitude numeric(7,4) NOT NULL,
  max_longitude numeric(7,4) NOT NULL,
  min_latitude numeric(7,4) NOT NULL,
  max_latitude numeric(7,4) NOT NULL,
  priority smallint NOT NULL,
  CONSTRAINT region_pk PRIMARY KEY (id),
  CONSTRAINT region_priority_key UNIQUE(priority)
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.data_group
(
  id bigserial NOT NULL,
  CONSTRAINT data_group_pk PRIMARY KEY (id)
)
WITH (
  OIDS=TRUE
);

CREATE TABLE us_design.dataset
(
  id bigserial NOT NULL,
  data_group_id bigint NOT NULL,
  edition_id bigint NOT NULL,
  design_code_variant_id bigint,
  region_id bigint NOT NULL,
  fa_table_id bigint NOT NULL,
  fv_table_id bigint NOT NULL,
  fpga_table_id bigint NOT NULL,
  grid_spacing double precision NOT NULL,
  ss_max_direction_factor double precision,
  s1_max_direction_factor double precision,
  factor_84_percent double precision,
  sec_0_0_det_floor double precision,
  sec_0_2_det_floor double precision,
  sec_1_0_det_floor double precision,
  CONSTRAINT dataset_pk PRIMARY KEY (id),
  CONSTRAINT dataset_edition_id FOREIGN KEY (edition_id)
      REFERENCES us_design.edition (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT dataset_data_group_id_fk FOREIGN KEY (data_group_id)
      REFERENCES us_design.data_group (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT dataset_design_code_variant_id_fk FOREIGN KEY (design_code_variant_id)
      REFERENCES us_design.design_code_variant (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT dataset_region_id_fk FOREIGN KEY (region_id)
      REFERENCES us_design.region (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT dataset_fa_table_id_fk FOREIGN KEY (fa_table_id)
      REFERENCES us_design.f_table (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT dataset_fpga_table_id_fk FOREIGN KEY (fpga_table_id)
      REFERENCES us_design.f_table (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT dataset_fv_table_id_fk FOREIGN KEY (fv_table_id)
      REFERENCES us_design.f_table (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE INDEX dataset_edition_id_idx
  ON us_design.dataset
  USING btree
  (edition_id);

CREATE INDEX dataset_region_id_idx
  ON us_design.dataset
  USING btree
  (region_id);

CREATE INDEX dataset_data_group_id_idx
  ON us_design.dataset
  USING btree
  (data_group_id);

CREATE UNIQUE INDEX ON us_design.dataset (edition_id, region_id, coalesce(design_code_variant_id, 0));
  
CREATE TABLE us_design.data
(
  id bigserial NOT NULL,
  data_group_id bigint NOT NULL,
  longitude numeric(7,4) NOT NULL,
  latitude numeric(7,4) NOT NULL,
  sec_0_0_uh double precision,
  sec_0_2_uh double precision,
  sec_1_0_uh double precision,
  sec_0_2_cr double precision,
  sec_1_0_cr double precision,
  sec_0_0_det double precision,
  sec_0_2_det double precision,
  sec_1_0_det double precision,
  pga double precision,
  ss double precision,
  s1 double precision,
  CONSTRAINT data_pk PRIMARY KEY (id),
  CONSTRAINT data_data_group_id_fk FOREIGN KEY (data_group_id)
      REFERENCES us_design.data_group (id) MATCH FULL
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=TRUE
);

CREATE INDEX data_data_group_id_idx
  ON us_design.data
  USING btree
  (data_group_id);

CREATE INDEX data_latitude_idx
  ON us_design.data
  USING btree
  (latitude);

CREATE INDEX data_longitude_idx
  ON us_design.data
  USING btree
  (longitude);

CREATE OR REPLACE VIEW us_design.f_data_vw AS
( SELECT a.id AS f_table_id, d.code AS site_soil_class_code, b.value AS ss_val, NULL::double precision AS s1_val, NULL::double precision AS pga_val, c.value AS fa, NULL::double precision AS fv, NULL::double precision AS fpga
FROM us_design.f_table a, us_design.f_header b, us_design.f_data c, us_design.site_soil_class d
WHERE b.f_table_id = a.id AND c.f_header_id = b.id AND a.type = 'fa' AND c.site_soil_class_id = d.id
UNION ALL
SELECT a.id AS f_table_id, d.code AS site_soil_class_code, NULL::double precision AS ss_val, b.value AS s1_val, NULL::double precision AS pga_val, NULL::double precision AS fa, c.value AS fv, NULL::double precision AS fpga
FROM us_design.f_table a, us_design.f_header b, us_design.f_data c, us_design.site_soil_class d
WHERE b.f_table_id = a.id AND c.f_header_id = b.id AND a.type = 'fv' AND c.site_soil_class_id = d.id)
UNION ALL
SELECT a.id AS f_table_id, d.code AS site_soil_class_code, NULL::double precision AS ss_val, NULL::double precision AS s1_val, b.value AS pga_val, NULL::double precision AS fa, NULL::double precision AS fv, c.value AS fpga
FROM us_design.f_table a, us_design.f_header b, us_design.f_data c, us_design.site_soil_class d
WHERE b.f_table_id = a.id AND c.f_header_id = b.id AND a.type = 'fpga' AND c.site_soil_class_id = d.id
ORDER BY 1,2,3,4,5;

		  
CREATE OR REPLACE VIEW us_design.risk_table_vw AS
	SELECT
		edition_id,
		table_type,
		CASE
			WHEN min_s_value IS NULL AND max_s_value IS NULL THEN
				''
			WHEN min_s_value IS NULL THEN
				'S_DS < '||max_s_value||'g'
			WHEN max_s_value IS NULL THEN
				min_s_value||'g <= S_DS'
			ELSE
				min_s_value||'g <= S_DS < '||max_s_value||'g'
			END s_value,
		design_categories[1] category1,
		design_categories[2] category2,
		design_categories[3] category3
	FROM
	(
		SELECT
			e.id edition_id,
			rt.table_type table_type,
			NULL min_s_value,
			NULL max_s_value,
			array_agg(rh.category_title ORDER BY rh.display_order ASC) design_categories
		FROM
			us_design.risk_header rh,
			us_design.risk_table rt,
			us_design.edition e
		WHERE
			rh.risk_table_id = rt.id AND
			rt.edition_id = e.id
		GROUP BY
			e.id,
			rt.table_type,
			rt.id
		UNION
		SELECT
			e.id edition_id,
			rt.table_type table_type,
			ri.min_s_value,
			ri.max_s_value,
			array_agg(rd.design_category ORDER BY rh.display_order ASC)
		FROM
			us_design.risk_data rd,
			us_design.risk_interval ri,
			us_design.risk_header rh,
			us_design.risk_table rt,
			us_design.edition e
		WHERE
			rd.risk_interval_id = ri.id AND
			rd.risk_header_id = rh.id AND
			rh.risk_table_id = rt.id AND
			ri.risk_table_id = rt.id AND
			rt.edition_id = e.id
		GROUP BY
			e.id,
			rt.table_type,
			ri.min_s_value,
			ri.max_s_value
	) a
	ORDER BY
		edition_id ASC,
		table_type ASC,
		min_s_value ASC NULLS FIRST,
		max_s_value ASC NULLS FIRST;

GRANT ALL ON TABLE us_design.data TO us_design;
GRANT ALL ON TABLE us_design.dataset TO us_design;
GRANT ALL ON TABLE us_design.data_group TO us_design;
GRANT ALL ON TABLE us_design.region TO us_design;
GRANT ALL ON TABLE us_design.f_data TO us_design;
GRANT ALL ON TABLE us_design.f_header TO us_design;
GRANT ALL ON TABLE us_design.f_table TO us_design;
GRANT ALL ON TABLE us_design.edition_site_soil_class TO us_design;
GRANT ALL ON TABLE us_design.site_soil_class TO us_design;
GRANT ALL ON TABLE us_design.design_code_variant TO us_design;
GRANT ALL ON TABLE us_design.risk_data TO us_design;
GRANT ALL ON TABLE us_design.risk_header TO us_design;
GRANT ALL ON TABLE us_design.risk_interval TO us_design;
GRANT ALL ON TABLE us_design.risk_table TO us_design;
GRANT ALL ON TABLE us_design.risk_category TO us_design;
GRANT ALL ON TABLE us_design.edition TO us_design;
GRANT ALL ON TABLE us_design.data_source TO us_design;