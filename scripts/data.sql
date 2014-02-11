DELETE FROM us_design.data;
DELETE FROM us_design.dataset;
DELETE FROM us_design.data_group;
DELETE FROM us_design.region;
DELETE FROM us_design.f_data;
DELETE FROM us_design.f_header;
DELETE FROM us_design.f_table;
DELETE FROM us_design.edition_site_soil_class;
DELETE FROM us_design.site_soil_class;
DELETE FROM us_design.design_code_variant;
DELETE FROM us_design.risk_data;
DELETE FROM us_design.risk_header;
DELETE FROM us_design.risk_interval;
DELETE FROM us_design.risk_table;
DELETE FROM us_design.edition;
DELETE FROM us_design.data_source;

INSERT INTO
	us_design.region
	(id, name, min_longitude, max_longitude, min_latitude, max_latitude, priority)
VALUES
	(1, 'Alaska', -200, -125, 48, 72, 1),
	(2, 'Conterminous 48 States', -125, -65, 24.6, 50, 2),
	(3, 'Hawaii', -161, -154, 18, 23, 3),
	(4, 'Puerto Rico', -70, -62, 16, 21, 4),
	(5, 'Guam', 139, 151, 9, 23, 5),
	(6, 'American Samoa', -195, -165, -33, -11, 6),
	(7, 'US: Salt Lake City', -112, -110, 40, 45, 7),
	(8, 'US: Pacific Northwest', -125, -123, 41, 49, 8),
	(9, 'US: California/Nevada', -125, -115, 32, 42, 9),
	(10, 'US: Central US', -92, -88, 35, 38, 10);

SELECT setval('us_design.region_id_seq', 10);

INSERT INTO
	us_design.site_soil_class
	(id, code, title, display_order)
VALUES
	(1, 'A', 'Site Class A - "Hard Rock"', 1),
	(2, 'B', 'Site Class B - "Rock"', 2),
	(3, 'C', 'Site Class C - "Very Dense Soil and Soft Rock"', 3),
	(4, 'D', 'Site Class D - "Stiff Soil"', 4),
	(5, 'E', 'Site Class E - "Soft Clay Soil"', 5),
	(6, 'U', 'Undefined', 6);

SELECT setval('us_design.site_soil_class_id_seq', 6);

INSERT INTO us_design.data_source (id, title, display_order) VALUES
	(1, 'Derived from USGS Hazard Data available in 2014', 1),
	(2, 'Derived from USGS Hazard Data available in 2008', 2),
	(3, 'Derived from USGS Hazard Data available in 2002', 3);

SELECT setval('us_design.data_source_id_seq', 3);

INSERT INTO
	us_design.edition
	(id, code, title, data_source_id, display_order, risk_category_label)
VALUES
	(1, 'nehrp-2015', 'Proposed for 2015 NEHRP (dev only)', 1, 1, NULL),
	(2, 'asce_41-2013', '2013 ASCE 41', 2, 2, NULL),
	(3, 'ibc-2012', '2012 IBC', 2, 3, 'Risk Category'),
	(4, 'asce-2010', '2010 ASCE 7 (w/July 2013 errata)', 2, 4, 'Risk Category'),
	(5, 'nehrp-2009', '2009 NEHRP', 2, 5, NULL),
	(6, 'aashto-2009', '2009 AASHTO', 3, 6, NULL),
	(7, 'ibc-2009', '2006/09 IBC', 3, 7, 'Occupancy Category'),
	(8, 'asce_41-2006', '2006 ASCE 41 (dev only)', 3, 8, NULL),
	(9, 'asce-2005', '2005 ASCE 7', 3, 9, 'Occupancy Category'),
	(10, 'nehrp-2003', '2003 NEHRP', 3, 10, 'Seismic Use Group');

SELECT setval('us_design.edition_id_seq', 10);

INSERT INTO
	us_design.design_code_variant
	(id, edition_id, code, requires_exceedence_probability, display_order)
VALUES
	(1, 2, 'BSE-2N', FALSE, 1),
	(2, 2, 'BSE-1N', FALSE, 2),
	(3, 2, 'BSE-2E', FALSE, 3),
	(4, 2, 'BSE-1E', FALSE, 4),
	(5, 2, 'Custom', TRUE, 5),
	(6, 8, 'BSE-1', FALSE, 6),
	(7, 8, 'BSE-2', FALSE, 7),
	(8, 8, 'Custom', TRUE, 8);

SELECT setval('us_design.design_code_variant_id_seq', 8);

INSERT INTO us_design.edition_site_soil_class (id, edition_id, site_soil_class_id) VALUES
	(1, 1, 1),
	(2, 1, 2),
	(3, 1, 3),
	(4, 1, 4),
	(5, 1, 5),
	(6, 1, 6),

	(7, 2, 1),
	(8, 2, 2),
	(9, 2, 3),
	(10, 2, 4),
	(11, 2, 5),

	(12, 3, 1),
	(13, 3, 2),
	(14, 3, 3),
	(15, 3, 4),
	(16, 3, 5),

	(17, 4, 1),
	(18, 4, 2),
	(19, 4, 3),
	(20, 4, 4),
	(21, 4, 5),

	(22, 5, 1),
	(23, 5, 2),
	(24, 5, 3),
	(25, 5, 4),
	(26, 5, 5),

	(27, 6, 1),
	(28, 6, 2),
	(29, 6, 3),
	(30, 6, 4),
	(31, 6, 5),

	(32, 7, 1),
	(33, 7, 2),
	(34, 7, 3),
	(35, 7, 4),
	(36, 7, 5),

	(37, 8, 1),
	(38, 8, 2),
	(39, 8, 3),
	(40, 8, 4),
	(41, 8, 5),

	(42, 9, 1),
	(43, 9, 2),
	(44, 9, 3),
	(45, 9, 4),
	(46, 9, 5),

	(47, 10, 1),
	(48, 10, 2),
	(49, 10, 3),
	(50, 10, 4),
	(51, 10, 5);

SELECT setval('us_design.edition_site_soil_class_id_seq', 51);

INSERT INTO us_design.f_table (id, type) VALUES
	(1, 'fa'),
	(2, 'fv'),
	(3, 'fpga'),
	(4, 'fa'),
	(5, 'fv'),
	(6, 'fpga');

SELECT setval('us_design.f_table_id_seq', 6);

INSERT INTO us_design.f_header (id, f_table_id, value) VALUES
	(1, 1, 0.25),
	(2, 1, 0.50),
	(3, 1, 0.75),
	(4, 1, 1.00),
	(5, 1, 1.25),

	(6, 2, 0.10),
	(7, 2, 0.20),
	(8, 2, 0.30),
	(9, 2, 0.40),
	(10, 2, 0.50),

	(11, 3, 0.10),
	(12, 3, 0.20),
	(13, 3, 0.30),
	(14, 3, 0.40),
	(15, 3, 0.50),

	(16, 4, 0.25),
	(17, 4, 0.50),
	(18, 4, 0.75),
	(19, 4, 1.00),
	(20, 4, 1.25),
	(21, 4, 1.50),

	(22, 5, 0.10),
	(23, 5, 0.20),
	(24, 5, 0.30),
	(25, 5, 0.40),
	(26, 5, 0.50),
	(27, 5, 0.60),

	(28, 6, 0.10),
	(29, 6, 0.20),
	(30, 6, 0.30),
	(31, 6, 0.40),
	(32, 6, 0.50),
	(33, 6, 0.60);

SELECT setval('us_design.f_header_id_seq', 33);

-- Table 1 (FA)
INSERT INTO us_design.f_data (id, site_soil_class_id, f_header_id, value) VALUES
	(1, 1, 1, 0.8),
	(2, 1, 2, 0.8),
	(3, 1, 3, 0.8),
	(4, 1, 4, 0.8),
	(5, 1, 5, 0.8),

	(6, 2, 1, 1.0),
	(7, 2, 2, 1.0),
	(8, 2, 3, 1.0),
	(9, 2, 4, 1.0),
	(10, 2, 5, 1.0),

	(11, 3, 1, 1.2),
	(12, 3, 2, 1.2),
	(13, 3, 3, 1.1),
	(14, 3, 4, 1.0),
	(15, 3, 5, 1.0),

	(16, 4, 1, 1.6),
	(17, 4, 2, 1.4),
	(18, 4, 3, 1.2),
	(19, 4, 4, 1.1),
	(20, 4, 5, 1.0),

	(21, 5, 1, 2.5),
	(22, 5, 2, 1.7),
	(23, 5, 3, 1.2),
	(24, 5, 4, 0.9),
	(25, 5, 5, 0.9);

-- Table 2 (FV)
INSERT INTO us_design.f_data (id, site_soil_class_id, f_header_id, value) VALUES
	(31, 1, 6, 0.8),
	(32, 1, 7, 0.8),
	(33, 1, 8, 0.8),
	(34, 1, 9, 0.8),
	(35, 1, 10, 0.8),

	(36, 2, 6, 1.0),
	(37, 2, 7, 1.0),
	(38, 2, 8, 1.0),
	(39, 2, 9, 1.0),
	(40, 2, 10, 1.0),

	(41, 3, 6, 1.7),
	(42, 3, 7, 1.6),
	(43, 3, 8, 1.5),
	(44, 3, 9, 1.4),
	(45, 3, 10, 1.3),

	(46, 4, 6, 2.4),
	(47, 4, 7, 2.0),
	(48, 4, 8, 1.8),
	(49, 4, 9, 1.6),
	(50, 4, 10, 1.5),

	(51, 5, 6, 3.5),
	(52, 5, 7, 3.2),
	(53, 5, 8, 2.8),
	(54, 5, 9, 2.4),
	(55, 5, 10, 2.4);

-- Table 3 (FPGA)
INSERT INTO us_design.f_data (id, site_soil_class_id, f_header_id, value) VALUES
	(61, 1, 11, 0.8),
	(62, 1, 12, 0.8),
	(63, 1, 13, 0.8),
	(64, 1, 14, 0.8),
	(65, 1, 15, 0.8),

	(66, 2, 11, 1.0),
	(67, 2, 12, 1.0),
	(68, 2, 13, 1.0),
	(69, 2, 14, 1.0),
	(70, 2, 15, 1.0),

	(71, 3, 11, 1.2),
	(72, 3, 12, 1.2),
	(73, 3, 13, 1.1),
	(74, 3, 14, 1.0),
	(75, 3, 15, 1.0),

	(76, 4, 11, 1.6),
	(77, 4, 12, 1.4),
	(78, 4, 13, 1.2),
	(79, 4, 14, 1.1),
	(80, 4, 15, 1.0),

	(81, 5, 11, 2.5),
	(82, 5, 12, 1.7),
	(83, 5, 13, 1.2),
	(84, 5, 14, 0.9),
	(85, 5, 15, 0.9);

-- Table 4 (NEHRP 2015 FA)
INSERT INTO us_design.f_data (id, site_soil_class_id, f_header_id, value) VALUES
	(91, 1, 16, 0.8),
	(92, 1, 17, 0.8),
	(93, 1, 18, 0.8),
	(94, 1, 19, 0.8),
	(95, 1, 20, 0.8),
	(96, 1, 21, 0.8),

	(97, 2, 16, 0.9),
	(98, 2, 17, 0.9),
	(99, 2, 18, 0.9),
	(100, 2, 19, 0.9),
	(101, 2, 20, 0.9),
	(102, 2, 21, 0.9),

	(103, 3, 16, 1.3),
	(104, 3, 17, 1.3),
	(105, 3, 18, 1.2),
	(106, 3, 19, 1.2),
	(107, 3, 20, 1.2),
	(108, 3, 21, 1.2),

	(109, 4, 16, 1.6),
	(110, 4, 17, 1.4),
	(111, 4, 18, 1.2),
	(112, 4, 19, 1.1),
	(113, 4, 20, 1.0),
	(114, 4, 21, 1.0),

	(115, 5, 16, 2.4),
	(116, 5, 17, 1.7),
	(117, 5, 18, 1.3),
	(118, 5, 19, 1.1),
	(119, 5, 20, 1.0),
	(120, 5, 22, 0.8),

	(121, 6, 16, 1.6),
	(122, 6, 17, 1.4),
	(123, 6, 18, 1.2),
	(124, 6, 19, 1.2),
	(125, 6, 20, 1.2),
	(126, 6, 21, 1.2);

-- Table 5 (NEHRP 2015 FV)
INSERT INTO us_design.f_data (id, site_soil_class_id, f_header_id, value) VALUES
	(133, 1, 22, 0.8),
	(134, 1, 23, 0.8),
	(135, 1, 24, 0.8),
	(136, 1, 25, 0.8),
	(137, 1, 26, 0.8),
	(138, 1, 27, 0.8),

	(139, 2, 22, 0.8),
	(140, 2, 23, 0.8),
	(141, 2, 24, 0.8),
	(142, 2, 25, 0.8),
	(143, 2, 26, 0.8),
	(144, 2, 27, 0.8),

	(145, 3, 22, 1.5),
	(146, 3, 23, 1.5),
	(147, 3, 24, 1.5),
	(148, 3, 25, 1.5),
	(149, 3, 26, 1.5),
	(150, 3, 27, 1.4),

	(151, 4, 22, 2.4),
	(152, 4, 23, 2.2),
	(153, 4, 24, 2.0),
	(154, 4, 25, 1.9),
	(155, 4, 26, 1.8),
	(156, 4, 27, 1.7),

	(157, 5, 22, 4.2),
	(158, 5, 23, 3.3),
	(159, 5, 24, 2.8),
	(160, 5, 25, 2.4),
	(161, 5, 26, 2.2),
	(162, 5, 27, 2.0),

	(163, 6, 22, 2.4),
	(164, 6, 23, 2.2),
	(165, 6, 24, 2.0),
	(166, 6, 25, 1.9),
	(167, 6, 26, 1.8),
	(168, 6, 27, 1.7);

-- Table 6 (NEHRP 2015 FPGA)
INSERT INTO us_design.f_data (id, site_soil_class_id, f_header_id, value) VALUES
	(175, 1, 28, 0.8),
	(176, 1, 29, 0.8),
	(177, 1, 30, 0.8),
	(178, 1, 31, 0.8),
	(179, 1, 32, 0.8),
	(180, 1, 33, 0.8),

	(181, 2, 28, 0.9),
	(182, 2, 29, 0.9),
	(183, 2, 30, 0.9),
	(184, 2, 31, 0.9),
	(185, 2, 32, 0.9),
	(186, 2, 33, 0.9),

	(187, 3, 28, 1.5),
	(188, 3, 29, 1.5),
	(189, 3, 30, 1.5),
	(190, 3, 31, 1.5),
	(191, 3, 32, 1.5),
	(192, 3, 33, 1.4),

	(193, 4, 28, 2.4),
	(194, 4, 29, 2.2),
	(195, 4, 30, 2.0),
	(196, 4, 31, 1.9),
	(197, 4, 32, 1.8),
	(198, 4, 33, 1.7),

	(199, 5, 28, 4.2),
	(200, 5, 29, 3.3),
	(201, 5, 30, 2.8),
	(202, 5, 31, 2.4),
	(203, 5, 32, 2.2),
	(204, 5, 33, 2.0),

	(205, 6, 28, 2.4),
	(206, 6, 29, 2.2),
	(207, 6, 30, 2.0),
	(208, 6, 31, 1.9),
	(209, 6, 32, 1.8),
	(210, 6, 33, 1.7);

SELECT setval('us_design.f_data_id_seq', 210);

INSERT INTO
	us_design.risk_table
	(id, edition_id, table_type)
VALUES
	(1, 3, 'SDS'),
	(2, 3, 'SD1'),

	(3, 4, 'SDS'),
	(4, 4, 'SD1'),

	(5, 6, 'SD1'),

	(6, 7, 'SDS'),
	(7, 7, 'SD1'),

	(8, 9, 'SDS'),
	(9, 9, 'SD1'),

	(10, 10, 'SDS'),
	(11, 10, 'SD1');

SELECT setval('us_design.risk_table_id_seq', 11);

INSERT INTO
	us_design.risk_header
	(id, risk_table_id, category_title, display_order)
VALUES
	(1, 1, 'I or II', 1),
	(2, 1, 'III', 2),
	(3, 1, 'IV', 3),

	(4, 2, 'I or II', 1),
	(5, 2, 'III', 2),
	(6, 2, 'IV', 3),

	(7, 3, 'I or II', 1),
	(8, 3, 'III', 2),
	(9, 3, 'IV', 3),

	(10, 4, 'I or II', 1),
	(11, 4, 'III', 2),
	(12, 4, 'IV', 3),

	(13, 5, 'SDC', 1),

	(14, 6, 'I or II', 1),
	(15, 6, 'III', 2),
	(16, 6, 'IV', 3),

	(17, 7, 'I or II', 1),
	(18, 7, 'III', 2),
	(19, 7, 'IV', 3),

	(20, 8, 'I or II', 1),
	(21, 8, 'III', 2),
	(22, 8, 'IV', 3),

	(23, 9, 'I or II', 1),
	(24, 9, 'III', 2),
	(25, 9, 'IV', 3),

	(26, 10, 'I', 1),
	(27, 10, 'II', 2),
	(28, 10, 'III', 3),

	(29, 11, 'I ', 1),
	(30, 11, 'II', 2),
	(31, 11, 'III', 3);

SELECT setval('us_design.risk_header_id_seq', 31);

INSERT INTO
	us_design.risk_interval
	(id, risk_table_id, min_s_value, max_s_value)
VALUES
	(1, 1, NULL, 0.167),
	(2, 1, 0.167, 0.33),
	(3, 1, 0.33, 0.50),
	(4, 1, 0.50, NULL),

	(5, 2, NULL, 0.067),
	(6, 2, 0.067, 0.133),
	(7, 2, 0.133, 0.20),
	(8, 2, 0.20, NULL),


	(9, 3, NULL, 0.167),
	(10, 3, 0.167, 0.33),
	(11, 3, 0.33, 0.50),
	(12, 3, 0.50, NULL),

	(13, 4, NULL, 0.067),
	(14, 4, 0.067, 0.133),
	(15, 4, 0.133, 0.20),
	(16, 4, 0.20, NULL),


	(17, 5, NULL, 0.15),
	(18, 5, 0.15, 0.30),
	(19, 5, 0.30, 0.50),
	(20, 5, 0.50, NULL),


	(21, 6, NULL, 0.167),
	(22, 6, 0.167, 0.33),
	(23, 6, 0.33, 0.50),
	(24, 6, 0.50, NULL),

	(25, 7, NULL, 0.067),
	(26, 7, 0.067, 0.133),
	(27, 7, 0.133, 0.20),
	(28, 7, 0.20, NULL),


	(29, 8, NULL, 0.167),
	(30, 8, 0.167, 0.33),
	(31, 8, 0.33, 0.50),
	(32, 8, 0.50, NULL),

	(33, 9, NULL, 0.067),
	(34, 9, 0.067, 0.133),
	(35, 9, 0.133, 0.20),
	(36, 9, 0.20, NULL),


	(37, 10, NULL, 0.167),
	(38, 10, 0.167, 0.33),
	(39, 10, 0.33, 0.50),
	(40, 10, 0.50, NULL),

	(41, 11, NULL, 0.067),
	(42, 11, 0.067, 0.133),
	(43, 11, 0.133, 0.20),
	(44, 11, 0.20, NULL);

SELECT setval('us_design.risk_interval_id_seq', 44);

INSERT INTO
	us_design.risk_data
	(id, risk_header_id, risk_interval_id, design_category)
VALUES
	(1, 1, 1, 'A'),
	(2, 2, 1, 'A'),
	(3, 3, 1, 'A'),
	(4, 1, 2, 'B'),
	(5, 2, 2, 'B'),
	(6, 3, 2, 'C'),
	(7, 1, 3, 'C'),
	(8, 2, 3, 'C'),
	(9, 3, 3, 'D'),
	(10, 1, 4, 'D'),
	(11, 2, 4, 'D'),
	(12, 3, 4, 'D'),

	(13, 4, 5, 'A'),
	(14, 5, 5, 'A'),
	(15, 6, 5, 'A'),
	(16, 4, 6, 'B'),
	(17, 5, 6, 'B'),
	(18, 6, 6, 'C'),
	(19, 4, 7, 'C'),
	(20, 5, 7, 'C'),
	(21, 6, 7, 'D'),
	(22, 4, 8, 'D'),
	(23, 5, 8, 'D'),
	(24, 6, 8, 'D'),

	(25, 7, 9, 'A'),
	(26, 8, 9, 'A'),
	(27, 9, 9, 'A'),
	(28, 7, 10, 'B'),
	(29, 8, 10, 'B'),
	(30, 9, 10, 'C'),
	(31, 7, 11, 'C'),
	(32, 8, 11, 'C'),
	(33, 9, 11, 'D'),
	(34, 7, 12, 'D'),
	(35, 8, 12, 'D'),
	(36, 9, 12, 'D'),

	(37, 10, 13, 'A'),
	(38, 11, 13, 'A'),
	(39, 12, 13, 'A'),
	(40, 10, 14, 'B'),
	(41, 11, 14, 'B'),
	(42, 12, 14, 'C'),
	(43, 10, 15, 'C'),
	(44, 11, 15, 'C'),
	(45, 12, 15, 'D'),
	(46, 10, 16, 'D'),
	(47, 11, 16, 'D'),
	(48, 12, 16, 'D'),

	(49, 13, 17, 'A'),
	(50, 13, 18, 'B'),
	(51, 13, 19, 'C'),
	(52, 13, 20, 'D'),

	(53, 14, 21, 'A'),
	(54, 15, 21, 'A'),
	(55, 16, 21, 'A'),
	(56, 14, 22, 'B'),
	(57, 15, 22, 'B'),
	(58, 16, 22, 'C'),
	(59, 14, 23, 'C'),
	(60, 15, 23, 'C'),
	(61, 16, 23, 'D'),
	(62, 14, 24, 'D'),
	(63, 15, 24, 'D'),
	(64, 16, 24, 'D'),

	(65, 17, 25, 'A'),
	(66, 18, 25, 'A'),
	(67, 19, 25, 'A'),
	(68, 17, 26, 'B'),
	(69, 18, 26, 'B'),
	(70, 19, 26, 'C'),
	(71, 17, 27, 'C'),
	(72, 18, 27, 'C'),
	(73, 19, 27, 'D'),
	(74, 17, 28, 'D'),
	(75, 18, 28, 'D'),
	(76, 19, 28, 'D'),

	(77, 20, 29, 'A'),
	(78, 21, 29, 'A'),
	(79, 22, 29, 'A'),
	(80, 20, 30, 'B'),
	(81, 21, 30, 'B'),
	(82, 22, 30, 'C'),
	(83, 20, 31, 'C'),
	(84, 21, 31, 'C'),
	(85, 22, 31, 'D'),
	(86, 20, 32, 'D'),
	(87, 21, 32, 'D'),
	(88, 22, 32, 'D'),

	(89, 23, 33, 'A'),
	(90, 24, 33, 'A'),
	(91, 25, 33, 'A'),
	(92, 23, 34, 'B'),
	(93, 24, 34, 'B'),
	(94, 25, 34, 'C'),
	(95, 23, 35, 'C'),
	(96, 24, 35, 'C'),
	(97, 25, 35, 'D'),
	(98, 23, 36, 'D'),
	(99, 24, 36, 'D'),
	(100, 25, 36, 'D'),

	(101, 26, 37, 'A'),
	(102, 27, 37, 'A'),
	(103, 28, 37, 'A'),
	(104, 26, 38, 'B'),
	(105, 27, 38, 'B'),
	(106, 28, 38, 'C'),
	(107, 26, 39, 'C'),
	(108, 27, 39, 'C'),
	(109, 28, 39, 'D'),
	(110, 26, 40, 'D'),
	(111, 27, 40, 'D'),
	(112, 28, 40, 'D'),

	(113, 29, 41, 'A'),
	(114, 30, 41, 'A'),
	(115, 31, 41, 'A'),
	(116, 29, 42, 'B'),
	(117, 30, 42, 'B'),
	(118, 31, 42, 'C'),
	(119, 29, 43, 'C'),
	(120, 30, 43, 'C'),
	(121, 31, 43, 'D'),
	(122, 29, 44, 'D'),
	(123, 30, 44, 'D'),
	(124, 31, 44, 'D');

SELECT setval('us_design.risk_data_id_seq', 124);

INSERT INTO
	us_design.risk_category
	(id, edition_id, category, display_order)
VALUES
	(1, 3, 'I or II or III', 1),
	(2, 3, 'IV (eg. essential facilities)', 2),
	(3, 4, 'I or II or III', 3),
	(4, 4, 'IV (eg. essential facilities)', 4),
	(5, 7, 'I or II or III', 5),
	(6, 7, 'IV (eg. essential facilities)', 6),
	(7, 9, 'I or II or III', 7),
	(8, 9, 'IV (eg. essential facilities)', 8),
	(9, 10, 'I or II', 7),
	(10, 10, 'III (eg. essential facilities)', 8);

SELECT setval('us_design.risk_category_id_seq', 10);
