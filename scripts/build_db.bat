SET PGPASSWORD=password

psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f structure.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f data.sql

psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 1998-HI-AASHTO-05-050-R1.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2002-US-AASHTO-05-050-R1.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2003-PRVI-AASHTO-05-050-R1.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2006-AK-AASHTO-05-050-R1.sql

psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 1998-HI-HAZ-R3aNL.20PC50.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 1998-HI-HAZ-R3aNL.5PC50.sql 
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2003-PRVI-HAZ-R3aNL.20PC50.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2003-PRVI-HAZ-R3aNL.5PC50.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f Alaska.Boyd_revFa.20PC50.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f Alaska.Boyd_revFa.5PC50.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f AmSam12.05grid.20PC50.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f AmSam12.05grid.5PC50.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f GuamNMI_hcsum.20PC50.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f GuamNMI_hcsum.5PC50.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f UShazard.20081229.20PC50.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f UShazard.20081229.5PC50.sql

psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 1998-HI-MCE-R1a.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2003-CANV-MCE-R1a.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2003-CEUS-MCE-R1a.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2003-PacNW-MCE-R1a.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2003-PRVI-MCE-R1a.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2003-SLC-MCE-Ra.sql
psql -h dev-ehpdb.cr.usgs.gov -p 5432 -U fort_admin -w -d neic -f 2003-US-MCE-R1a.sql

