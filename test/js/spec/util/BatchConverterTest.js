/* global after, before, chai, describe, it, sinon */
'use strict';


var Calculation = require('Calculation'),
    NEHRPCalc2015 = require('NEHRPCalc2015'),

    BatchConverter = require('util/BatchConverter'),

    Util = require('util/Util'),

    la = require('etc/la');


var expect = chai.expect;

var calculator,
    calcLA;

calculator = NEHRPCalc2015();
calcLA = Calculation(Util.extend({}, la,
    {status: Calculation.STATUS_COMPLETE}));

calculator.getResult(calcLA);


describe('BatchConverter', function () {
  describe('initialization', function () {
    it('can be required without blowing up', function () {
      /* jshint -W030 */
      expect(BatchConverter).to.not.be.undefined;
      /* jshint +W030 */
    });

    it('can be instantiated without blowing up', function () {
      var converter;

      converter = BatchConverter;

      /* jshint -W030 */
      expect(converter).to.not.be.undefined;
      /* jshint +W030 */
    });

    it('conforms to the specified API', function () {
      var converter;

      converter = BatchConverter();

      expect(converter).to.respondTo('destroy');
      expect(converter).to.respondTo('toCalculation');
      expect(converter).to.respondTo('toCSV');
    });
  });

  describe('toCalculation', function () {
    var converter,
        input,
        results,
        spy;

    before(function () {
      converter = BatchConverter();
      input = la.input;

      spy = sinon.spy();
      converter.on('error', spy);

      results = converter.toCalculation([
        // Header
        [
          'latitude', 'longitude', 'site_class',
          'risk_category', 'design_code', 'title'
        ].join(','),

        '', // blank line

        // L.A. input
        [
          input.latitude, input.longitude, input.site_class,
          input.risk_category, input.design_code, input.title
        ].join(','),

        '', // blank line

        ['foo', 'bar', 'baz'].join(','), // error line
      ].join('\n'));
    });

    after(function () {
      converter.destroy();

      spy = null;
      input = null;
      converter = null;
      results = null;
    });

    it('skips blank lines', function () {
      expect(results.length).to.equal(1);
    });

    it('returns valid calculations', function () {
      var parsed;

      parsed = results[0].get('input').get();

      expect(parsed.latitude).to.equal(input.latitude);
      expect(parsed.longitude).to.equal(input.longitude);
      expect(parsed.site_class).to.equal(input.site_class);
      expect(parsed.risk_category).to.equal(input.risk_category);
      expect(parsed.design_code).to.equal(input.design_code);
      expect(parsed.title).to.equal(input.title);
    });

    it('warns on errors', function () {
      expect(spy.callCount).to.equal(1);
    });
  });

  describe('toCSV', function () {
    var converter,
        results;

    before(function () {
      converter = BatchConverter();

      results = converter.toCSV([Calculation(), calcLA, Calculation()]);
    });

    after(function () {
      converter.destroy();

      results = null;
      converter = null;
    });

    it('skips calculations that are not complete', function () {
      var rows;

      rows = results.split('\n');
      expect(rows.length).to.equal(2); // 1 header line + 1 calculation
    });

    it('returns good csv', function () {
      var dataRow,
          headerRow,
          lines;


      headerRow = [
        'latitude', 'longitude', 'site_class',
        'risk_category', 'design_code', 'title',

        'crs', 'cr1', 'ssuh', 's1uh', 'ssd', 's1d',
        'ss', 's1', 'pga',

        'fa', 'fv', 'fpga',
        'sms', 'sm1', 'pgam',

        'sds', 'sd1', 'tl'
      ].join(',');

      dataRow = [
        '34', '-118', '4',
        '1', '1', '"Los Angeles, CA"',

        '0.89639', '0.89975', '2.10594', '0.74322', '2.43202', '0.96349',
        '1.88774', '0.66871', '0.56709',

        '1.00000', '1.70000', '1.10000',
        '1.88774', '1.13681', '0.62380',

        '1.25850', '0.75787', '' // tl probably will be '8' once implemented
      ].join(',');

      lines = results.split('\n');

      expect(lines[0]).to.equal(headerRow);
      expect(lines[1]).to.equal(dataRow);
    });
  });
});
