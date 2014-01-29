#!C:\Programs\StrawberryPerl\perl\bin\perl.exe

use strict;
use warnings;

sub trim {
	my ($self, $text) = @_;
	$text = $self
		if ref(\$self) =~ m/^SCALAR/i;
	# return empty string if $text is not defined
	return "" unless $text;
	$text =~ s/^\s+//;
	$text =~ s/\s+$//;
	return $text;
}

my $record_length = 4 + 4 + 4 + 4 + 4 + 4;

if (!$ARGV[0]) {
	print "Usage: perl convert_nehrp_sql.perl INPUT_FILE EDITION (OUT_FILE)\n";
	exit;
}

# Figure out the edition, and input and output file names.
my $filename = "$ARGV[0]";
my $filename_out = $filename;
$filename_out =~ s/\.[0-9a-zA-z]+$/\.sql/;
if ($ARGV[2]) { $filename_out = $ARGV[2]; }
print "\n";
print "Writing to $filename_out.\n";

# Open files.
open(BFILE, $filename) or die "Cannot open binary file for reading.\n";
my $bfile_size = -s $filename;
open(OUTFILE, ">", $filename_out)
	or die "Cannot open output file for writing.\n";

# Get edition.
my $edition = trim($ARGV[1]);
if ($edition ne "" && $edition ne "nehrp-2015" &&
	$edition ne "asce_41-2013,1e" && $edition ne "asce_41-2013,2e" &&
	$edition ne "ibc-2012" && $edition ne "asce-2010" &&
	$edition ne "nehrp-2009" && $edition ne "aashto-2009" &&
	$edition ne "ibc-2009" && $edition ne "asce_41-2006" &&
	$edition ne "asce-2005" && $edition ne "nehrp-2003")
	{ print "Invalid edition.\n:"; exit; }
if ($edition eq "") {
	print "Using edition nehrp-2015.\n";
	$edition = "nehrp-2015";
}
my $dcv = "NULL";

if ($edition eq "asce_41-2013,1e") {
	$edition = "asce_41-2013";
	$dcv = "(SELECT id FROM us_design.design_code_variant ".
		"WHERE code = 'BSE-1E' LIMIT 1)";
}

if ($edition eq "asce_41-2013,2e") {
	$edition = "asce_41-2013";
	$dcv = "(SELECT id FROM us_design.design_code_variant ".
		"WHERE code = 'BSE-2E' LIMIT 1)";
}

# Find grid spacing. Start by reading record #4 (the first data record).
my $record_read_num = 4;
seek(BFILE, ($record_read_num - 1) * $record_length, 0);
read(BFILE, my $record, $record_length);
my ($record_number, $lat, $lon, $num_vals, $v1, $v2) =
	unpack("i f f s f f", $record);
my $rec4_lon = sprintf("%.4f", $lon);
my $rec4_lat = sprintf("%.4f", $lat);

# Read the second data record to find the difference.
$record_read_num = 5;
seek(BFILE, ($record_read_num - 1) * $record_length, 0);
read(BFILE, $record, $record_length);
($record_number, $lat, $lon, $num_vals, $v1, $v2) =
	unpack("i f f s f f", $record);
my $rec5_lon = sprintf("%.4f", $lon);

# Calculate grid spacing.
my $grid_spacing = sprintf("%.4f", $rec5_lon - $rec4_lon);

# These are the table IDs for the F Tables.
my $fa = 1;
my $fv = 2;
my $fpga = 3;
if ($edition eq "nehrp-2015") {
	$fa = 4;
	$fv = 5;
	$fpga = 6;
}

# Insert dataset record.
print OUTFILE "DO \$\$
DECLARE datagroup_rec_num INTEGER;
BEGIN
	-- Get the next index for the new dataset record.
	datagroup_rec_num := nextval('data_group_id_seq');

	INSERT INTO us_design.data_group (id) VALUES (datagroup_rec_num);
	
	INSERT INTO
		us_design.dataset
		(data_group_id, edition_id, design_code_variant_id, region_id,
		fa_table_id, fv_table_id, fpga_table_id, grid_spacing)
		VALUES
		(
			datagroup_rec_num,
			(SELECT id FROM us_design.edition WHERE code = '$edition' LIMIT 1),
			$dcv,
			(SELECT id FROM us_design.region WHERE
				min_longitude <= $rec4_lon AND
				max_longitude >= $rec4_lon AND
				min_latitude <= $rec4_lat AND
				max_latitude >= $rec4_lat
				ORDER BY priority DESC
				LIMIT 1),
			$fa,
			$fv,
			$fpga,
			$grid_spacing
		);\n\n";

print OUTFILE "	INSERT INTO us_design.data
		(data_group_id, latitude, longitude, ss, s1)
		VALUES ";
		
print "Converting $bfile_size bytes.\n";
for ($record_read_num = 4;
	($record_read_num - 1) * $record_length < $bfile_size;
	$record_read_num++) {

	# Read binary record.
	seek(BFILE, ($record_read_num - 1) * $record_length, 0);
	
	# This exception handles the weird, corrupt data in the files that's
	# off by one byte for some reason.
	if ($record_read_num % 65536 == 2573)
		{ seek(BFILE, ($record_read_num - 1) * $record_length - 1, 0); }
	if ($record_read_num >= 658688 && $record_read_num <= 658943)
		{ seek(BFILE, ($record_read_num - 1) * $record_length - 1, 0); }
	
	read(BFILE, $record, $record_length);
	
	# Convert binary record to readable Perl variables.
	($record_number, $lat, $lon, $num_vals, $v1, $v2) =
		unpack("i f f s f f", $record);
	
	# Format numbers, round to correct significance.
	my $lat_str = sprintf("%.4f", $lat);
	my $lon_str = sprintf("%.4f", $lon);
	my $v1_str = $v1 ? sprintf("%.15f", $v1 / 100) : "";
	my $v2_str = $v2 ? sprintf("%.15f", $v2 / 100) : "";

	if ($num_vals < 1) { $v1_str = "NULL"; }
	if ($num_vals < 2) { $v2_str = "NULL"; }

	# Don't print blank data.
	if ($record_number == 0) { next; }
	
	# Look for corrupt data
	if ($record_read_num != $record_number) {
		print "	Bad data, #$record_read_num: ".
			"($record_number, $lat_str, $lon_str, $v1_str, $v2_str)\n";
		
		# my $hex_record = unpack("H*", $record);
		# print "	#$record_read_num: $hex_record\n";
	}
	
	# Write record to file.
	if ($record_read_num > 4) { print OUTFILE ",\n		"; }
	print OUTFILE "(datagroup_rec_num, $lat_str, $lon_str, $v1_str, $v2_str)";
}

print OUTFILE ";\n";
print OUTFILE "END \$\$;";
close(OUTFILE);
