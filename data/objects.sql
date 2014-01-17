DROP TABLE us_design.edition CASCADE;
DROP TABLE us_design.site_soil_class CASCADE;
DROP TABLE us_design.design_code_variant CASCADE;
DROP TABLE us_design.region CASCADE;
DROP TABLE us_design.dataset CASCADE;
DROP TABLE us_design.data CASCADE;
DROP TABLE us_design.risk_header CASCADE;
DROP TABLE us_design.data_source CASCADE;
DROP TABLE us_design.edition_site_soil_class CASCADE;
DROP TABLE us_design.risk_table CASCADE;
DROP TABLE us_design.f_data CASCADE;
DROP TABLE us_design.f_header CASCADE;
DROP TABLE us_design.f_table CASCADE;
DROP TABLE us_design.risk_interval CASCADE;
DROP TABLE us_design.risk_data CASCADE;
DROP TABLE us_design.risk_category CASCADE;

CREATE TABLE us_design.edition(
	id bigserial,
	code varchar(20) NOT NULL,
	title varchar(100) NOT NULL,
	data_source_id bigint NOT NULL,
	display_order smallint NOT NULL,
	risk_category_label varchar(100),
	CONSTRAINT edition_pk PRIMARY KEY (id)

);

CREATE TABLE us_design.site_soil_class(
	id bigserial,
	code varchar,
	title varchar(100) NOT NULL,
	display_order smallint NOT NULL,
	CONSTRAINT site_soil_class_pk PRIMARY KEY (id)

);

CREATE TABLE us_design.design_code_variant(
	id bigserial,
	edition_id bigint NOT NULL,
	code varchar(20) NOT NULL,
	requires_exceedence_probablilty boolean NOT NULL,
	display_order smallint NOT NULL,
	CONSTRAINT design_code_variant_pk PRIMARY KEY (id)

);

CREATE TABLE us_design.region(
	id bigserial,
	name varchar(100) NOT NULL,
	min_longitude numeric(7,4) NOT NULL,
	max_longitude numeric(7,4) NOT NULL,
	min_latitude numeric(7,4) NOT NULL,
	max_latitude numeric(7,4) NOT NULL,
	priority smallint NOT NULL,
	CONSTRAINT region_pk PRIMARY KEY (id),
	CONSTRAINT region_priority_unique UNIQUE (priority)

);

CREATE TABLE us_design.dataset(
	id bigserial,
	edition_id bigint NOT NULL,
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
	design_code_variant_id bigint,
	CONSTRAINT dataset_pk PRIMARY KEY (id)

);

CREATE INDEX dataset_edition_id_idx ON us_design.dataset
	USING btree
	(
	  edition_id ASC NULLS LAST
	);

CREATE INDEX dataset_region_id_idx ON us_design.dataset
	USING btree
	(
	  region_id ASC NULLS LAST
	);

CREATE TABLE us_design.data(
	id bigserial,
	dataset_id bigint NOT NULL,
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
	ss double precision,
	s1 double precision,
	CONSTRAINT data_pk PRIMARY KEY (id)

);

CREATE INDEX data_dataset_id_idx ON us_design.data
	USING btree
	(
	  dataset_id ASC NULLS LAST
	);

CREATE INDEX data_longitude_idx ON us_design.data
	USING btree
	(
	  longitude ASC NULLS LAST
	);

CREATE INDEX data_latitude_idx ON us_design.data
	USING btree
	(
	  latitude ASC NULLS LAST
	);

REM TODO: Figure out how to deal with embedded ; in stored function defs.
REM CREATE OR REPLACE FUNCTION US_DESIGN.TSUBL_VALUE (LONGITUDE IN NUMERIC, LATITUDE IN NUMERIC) 
	RETURNS INTEGER AS $$;
	DECLARE RETURN_VAL INTEGER;
	BEGIN
		SELECT value INTO RETURN_VAL FROM US_DESIGN.TSUBL WHERE
			SDE.ST_DISJOINT(SHAPE, SDE.ST_POINT($1, $2, 4326))=false
			ORDER BY VALUE DESC;
		RETURN COALESCE(RETURN_VAL,-1);
	END;
REM $$ LANGUAGE PLPGSQL;

CREATE TABLE us_design.risk_header(
	id bigserial,
	risk_table_id bigint NOT NULL,
	category_title varchar(100) NOT NULL,
	display_order smallint NOT NULL,
	CONSTRAINT risk_header_pk PRIMARY KEY (id)

);

CREATE INDEX risk_header_risk_table_id_idx ON us_design.risk_header
	USING btree
	(
	  risk_table_id ASC NULLS LAST
	);

CREATE TABLE us_design.data_source(
	id bigserial,
	title varchar(100) NOT NULL,
	display_order smallint NOT NULL,
	CONSTRAINT data_source_pk PRIMARY KEY (id)

);

CREATE TABLE us_design.edition_site_soil_class(
	id bigserial,
	edition_id bigint NOT NULL,
	site_soil_class_id bigint NOT NULL,
	CONSTRAINT edition_site_soil_class_pk PRIMARY KEY (id)

);

CREATE TABLE us_design.risk_table(
	id bigserial,
	edition_id bigint NOT NULL,
	table_type varchar(5) NOT NULL,
	CONSTRAINT risk_table_pk PRIMARY KEY (id),
	CONSTRAINT risk_table_type_ck CHECK (table_type in ('SDS', 'SD1'))

);

CREATE TABLE us_design.f_data(
	id bigserial,
	site_soil_class_id bigint NOT NULL,
	f_header_id bigint NOT NULL,
	value double precision NOT NULL,
	CONSTRAINT f_data_pk PRIMARY KEY (id)

);

CREATE INDEX f_data_f_header_id_idx ON us_design.f_data
	USING btree
	(
	  f_header_id ASC NULLS LAST
	);

CREATE TABLE us_design.f_header(
	id bigserial,
	f_table_id bigint NOT NULL,
	value double precision NOT NULL,
	CONSTRAINT f_header_pk PRIMARY KEY (id)

);

CREATE INDEX f_header_f_table_id_idx ON us_design.f_header
	USING btree
	(
	  f_table_id ASC NULLS LAST
	);

CREATE TABLE us_design.f_table(
	id bigserial,
	type varchar(4) NOT NULL,
	CONSTRAINT f_table_pk PRIMARY KEY (id),
	CONSTRAINT f_table_type_ck CHECK (type in ('fa','fv','fpga'))

);

CREATE OR REPLACE VIEW us_design.f_data_vw AS 
        (         SELECT a.id AS f_table_id, d.code AS site_soil_class_code, b.value AS ss_val, NULL::double precision AS s1_val, NULL::double precision AS pga_val, c.value AS fa, NULL::double precision AS fv, NULL::double precision AS fpga
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

CREATE TABLE us_design.risk_interval(
	id bigserial,
	risk_table_id bigint NOT NULL,
	min_s_value double precision,
	max_s_value double precision,
	CONSTRAINT risk_interval_pk PRIMARY KEY (id)

);

CREATE INDEX risk_interval_risk_table_id_idx ON us_design.risk_interval
	USING btree
	(
	  risk_table_id ASC NULLS LAST
	);

CREATE TABLE us_design.risk_data(
	id bigserial,
	risk_header_id bigint NOT NULL,
	risk_interval_id bigint NOT NULL,
	design_category varchar NOT NULL,
	CONSTRAINT risk_data_pk PRIMARY KEY (id)

);

CREATE INDEX risk_data_risk_header_id_idx ON us_design.risk_data
	USING btree
	(
	  risk_header_id ASC NULLS LAST
	);

CREATE INDEX risk_data_risk_interval_id_idx ON us_design.risk_data
	USING btree
	(
	  risk_interval_id ASC NULLS LAST
	);

CREATE OR REPLACE VIEW us_design.risk_table_vw AS 
 SELECT a.edition_id, a.table_type, 
        CASE
            WHEN a.min_s_value IS NULL AND a.max_s_value IS NULL THEN ''::text
            WHEN a.min_s_value IS NULL THEN ('S_DS < '::text || a.max_s_value) || 'g'::text
            WHEN a.max_s_value IS NULL THEN a.min_s_value || 'g <= S_DS'::text
            ELSE ((a.min_s_value || 'g <= S_DS < '::text) || a.max_s_value) || 'g'::text
        END AS s_value, a.design_categories[1] AS category1, a.design_categories[2] AS category2, a.design_categories[3] AS category3
   FROM (         SELECT e.id AS edition_id, rt.table_type, NULL::double precision AS min_s_value, NULL::double precision AS max_s_value, array_agg(rh.category_title ORDER BY rh.display_order) AS design_categories
                   FROM us_design.risk_header rh, us_design.risk_table rt, us_design.edition e
                  WHERE rh.risk_table_id = rt.id AND rt.edition_id = e.id
                  GROUP BY e.id, rt.table_type, rt.id
        UNION 
                 SELECT e.id AS edition_id, rt.table_type, ri.min_s_value, ri.max_s_value, array_agg(rd.design_category ORDER BY rh.display_order) AS array_agg
                   FROM us_design.risk_data rd, us_design.risk_interval ri, us_design.risk_header rh, us_design.risk_table rt, us_design.edition e
                  WHERE rd.risk_interval_id = ri.id AND rd.risk_header_id = rh.id AND rh.risk_table_id = rt.id AND ri.risk_table_id = rt.id AND rt.edition_id = e.id
                  GROUP BY e.id, rt.table_type, ri.min_s_value, ri.max_s_value) a
  ORDER BY a.edition_id, a.table_type, a.min_s_value NULLS FIRST, a.max_s_value NULLS FIRST;

CREATE TABLE us_design.risk_category(
	id bigserial,
	edition_id bigint NOT NULL,
	category varchar(100) NOT NULL,
	display_order smallint NOT NULL,
	CONSTRAINT risk_category_pk PRIMARY KEY (id)

);

ALTER TABLE us_design.edition ADD CONSTRAINT edition_data_source_id_fk FOREIGN KEY (data_source_id)
REFERENCES us_design.data_source (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.design_code_variant ADD CONSTRAINT design_code_variant_edition_id_fk FOREIGN KEY (edition_id)
REFERENCES us_design.edition (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.dataset ADD CONSTRAINT dataset_region_id_fk FOREIGN KEY (region_id)
REFERENCES us_design.region (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.dataset ADD CONSTRAINT dataset_edition_id FOREIGN KEY (edition_id)
REFERENCES us_design.edition (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.dataset ADD CONSTRAINT dataset_fa_table_id_fk FOREIGN KEY (fa_table_id)
REFERENCES us_design.f_table (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.dataset ADD CONSTRAINT dataset_fv_table_id_fk FOREIGN KEY (fv_table_id)
REFERENCES us_design.f_table (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.dataset ADD CONSTRAINT dataset_fpga_table_id_fk FOREIGN KEY (fpga_table_id)
REFERENCES us_design.f_table (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.dataset ADD CONSTRAINT dataset_design_code_variant_fk FOREIGN KEY (design_code_variant_id)
REFERENCES us_design.design_code_variant (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.data ADD CONSTRAINT data_dataset_id_fk FOREIGN KEY (dataset_id)
REFERENCES us_design.dataset (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.risk_header ADD CONSTRAINT risk_header_risk_table_id FOREIGN KEY (risk_table_id)
REFERENCES us_design.risk_table (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.edition_site_soil_class ADD CONSTRAINT edition_site_soil_class_edition_id_fk FOREIGN KEY (edition_id)
REFERENCES us_design.edition (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.edition_site_soil_class ADD CONSTRAINT edition_site_soil_class_site_soil_class_id_fk FOREIGN KEY (site_soil_class_id)
REFERENCES us_design.site_soil_class (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.risk_table ADD CONSTRAINT risk_table_edition_id_fk FOREIGN KEY (edition_id)
REFERENCES us_design.edition (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.f_data ADD CONSTRAINT f_data_site_soil_class_id_fk FOREIGN KEY (site_soil_class_id)
REFERENCES us_design.site_soil_class (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.f_data ADD CONSTRAINT f_data_f_header_id_fk FOREIGN KEY (f_header_id)
REFERENCES us_design.f_header (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.f_header ADD CONSTRAINT f_header_f_table_id_fk FOREIGN KEY (f_table_id)
REFERENCES us_design.f_table (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.risk_interval ADD CONSTRAINT risk_interval_risk_table_id_fk FOREIGN KEY (risk_table_id)
REFERENCES us_design.risk_table (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.risk_data ADD CONSTRAINT risk_data_risk_header_id_fk FOREIGN KEY (risk_header_id)
REFERENCES us_design.risk_header (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.risk_data ADD CONSTRAINT risk_data_risk_interval_id_fk FOREIGN KEY (risk_interval_id)
REFERENCES us_design.risk_interval (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;

ALTER TABLE us_design.risk_category ADD CONSTRAINT risk_category_edition_id_fk FOREIGN KEY (edition_id)
REFERENCES us_design.edition (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION NOT DEFERRABLE;
