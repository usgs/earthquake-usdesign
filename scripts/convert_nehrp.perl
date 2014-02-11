#!C:\Programs\StrawberryPerl\perl\bin\perl.exe

use strict;
use warnings;

my $record_length = 4 + 4 + 4 + 4 + 4 + 4;

if (!$ARGV[0]) { print "Usage: perl convert_nehrp.perl INPUT_FILE (OUT_FILE)\n"; exit; }

# Figure out the input and outfput file names.
my $filename = "$ARGV[0]";
my $filename_out = $filename;
$filename_out =~ s/\.[0-9a-zA-z]+$/\.csv/;
if ($ARGV[1]) { $filename_out = $ARGV[1]; }
print "\n";
print "Writing to $filename_out.\n";

# Open files.
open(BFILE, $filename) or die "Cannot open binary file for reading.\n";
my $bfile_size = -s $filename;
open(OUTFILE, ">", $filename_out) or die "Cannot open output file for writing.\n";
print "Converting $bfile_size bytes.\n";

# Header row.
print OUTFILE "Record,Latitude,Longitude,# Values,Value 1,Value 2\n";

my $record_read_num;
for ($record_read_num = 1; ($record_read_num - 1) * $record_length < $bfile_size; $record_read_num++)
{
	# Read binary record.
	seek(BFILE, ($record_read_num - 1) * $record_length, 0);
	read(BFILE, my $record, $record_length);

	# Convert binary record to readable Perl variables.
	my ($record_number, $lat, $lon, $num_vals, $v1, $v2) = unpack("i f f s f f", $record);

	# Format numbers, round to correct significance.
	my $lat_str = sprintf("%.4f", $lat);
	my $lon_str = sprintf("%.4f", $lon);
	my $v1_str = $v1 ? sprintf("%.15f", $v1 / 100) : "";
	my $v2_str = $v2 ? sprintf("%.15f", $v2 / 100) : "";

	# Write record to file.
	print OUTFILE "$record_number,$lat_str,$lon_str,$num_vals";
	if ($num_vals >= 1) { print OUTFILE ",$v1_str"; }
	if ($num_vals >= 2) { print OUTFILE ",$v2_str"; }
	print OUTFILE "\n";
}

close(OUTFILE);




