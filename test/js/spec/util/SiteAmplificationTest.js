/* global after, before, chai, describe, it */
'use strict';

var SiteAmplification = require('util/SiteAmplification');

var EPSILON = 1E-5,
    expect = chai.expect;

describe('SiteAmplification', function () {
  var amp;

  before(function () {
    amp = SiteAmplification();
  });

  after(function () {
    amp.destroy();
    amp = null;
  });

  describe('Constructor', function () {
    it('conforms to the api', function () {
      expect(amp).to.respondTo('getFa');
      expect(amp).to.respondTo('getFaTable');
      expect(amp).to.respondTo('getFpga');
      expect(amp).to.respondTo('getFpgaTable');
      expect(amp).to.respondTo('getFv');
      expect(amp).to.respondTo('getFvTable');
      // expect(amp).to.respondTo('getUndeterminedPgaTable');
      // expect(amp).to.respondTo('getUndeterminedSsS1Table');
      expect(amp).to.respondTo('destroy');
    });
  });

  describe('Fa', function () {
    it('computes properly when the input is below range', function () {
      var ss = 0.20;

      expect(amp.getFa(ss, 'A')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFa(ss, 'B (measured)')).to.be.closeTo(0.9, EPSILON);
      expect(amp.getFa(ss, 'C')).to.be.closeTo(1.3, EPSILON);
      expect(amp.getFa(ss, 'D (determined)')).to.be.closeTo(1.6, EPSILON);
      // expect(amp.getFa(ss, 'E')).to.be.closeTo(2.4, EPSILON);
      expect(amp.getFa(ss, 'D (default)')).to.be.closeTo(1.6, EPSILON);
    });


    it('computes properly when the input is above range', function () {
      var ss = 1.6;

      expect(amp.getFa(ss, 'A')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFa(ss, 'B (measured)')).to.be.closeTo(0.9, EPSILON);
      expect(amp.getFa(ss, 'C')).to.be.closeTo(1.2, EPSILON);
      expect(amp.getFa(ss, 'D (determined)')).to.be.closeTo(1.0, EPSILON);
      // expect(amp.getFa(ss, 'E')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFa(ss, 'D (default)')).to.be.closeTo(1.2, EPSILON);
    });

    it('computes properly when the input is interpolated', function () {
      var ss = 0.625;

      expect(amp.getFa(ss, 'A')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFa(ss, 'B (measured)')).to.be.closeTo(0.9, EPSILON);
      expect(amp.getFa(ss, 'C')).to.be.closeTo(1.25, EPSILON);
      expect(amp.getFa(ss, 'D (determined)')).to.be.closeTo(1.3, EPSILON);
      // expect(amp.getFa(ss, 'E')).to.be.closeTo(1.5, EPSILON);
      expect(amp.getFa(ss, 'D (default)')).to.be.closeTo(1.3, EPSILON);
    });
  });

  describe('Fv', function () {
    it('computes properly when the input is below range', function () {
      var s1 = 0.09;

      expect(amp.getFv(s1, 'A')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFv(s1, 'B (measured)')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFv(s1, 'C')).to.be.closeTo(1.5, EPSILON);
      expect(amp.getFv(s1, 'D (determined)')).to.be.closeTo(2.4, EPSILON);
      // expect(amp.getFv(s1, 'E')).to.be.closeTo(4.2, EPSILON);
      expect(amp.getFv(s1, 'D (default)')).to.be.closeTo(2.4, EPSILON);
    });

    it('computes properly when the input is above range', function () {
      var s1 = 0.7;

      expect(amp.getFv(s1, 'A')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFv(s1, 'B (measured)')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFv(s1, 'C')).to.be.closeTo(1.4, EPSILON);
      expect(amp.getFv(s1, 'D (determined)')).to.be.closeTo(1.7, EPSILON);
      // expect(amp.getFv(s1, 'E')).to.be.closeTo(2.0, EPSILON);
      expect(amp.getFv(s1, 'D (default)')).to.be.closeTo(1.7, EPSILON);
    });

    it('computes properly when the input is interpolated', function () {
      var s1 = 0.45;

      expect(amp.getFv(s1, 'A')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFv(s1, 'B (measured)')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFv(s1, 'C')).to.be.closeTo(1.5, EPSILON);
      expect(amp.getFv(s1, 'D (determined)')).to.be.closeTo(1.85, EPSILON);
      // expect(amp.getFv(s1, 'E')).to.be.closeTo(2.3, EPSILON);
      expect(amp.getFv(s1, 'D (default)')).to.be.closeTo(1.85, EPSILON);
    });
  });

  describe('Fpga', function () {
    it('computes properly when the input is below range', function () {
      var pga = 0.09;

      expect(amp.getFpga(pga, 'A')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFpga(pga, 'B (measured)')).to.be.closeTo(0.9, EPSILON);
      expect(amp.getFpga(pga, 'C')).to.be.closeTo(1.3, EPSILON);
      expect(amp.getFpga(pga, 'D (determined)')).to.be.closeTo(1.6, EPSILON);
      // expect(amp.getFpga(pga, 'E')).to.be.closeTo(2.4, EPSILON);
      expect(amp.getFpga(pga, 'D (default)')).to.be.closeTo(1.6, EPSILON);
    });

    it('computes properly when the input is above range', function () {
      var pga = 0.7;

      expect(amp.getFpga(pga, 'A')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFpga(pga, 'B (measured)')).to.be.closeTo(0.9, EPSILON);
      expect(amp.getFpga(pga, 'C')).to.be.closeTo(1.2, EPSILON);
      expect(amp.getFpga(pga, 'D (determined)')).to.be.closeTo(1.1, EPSILON);
      // expect(amp.getFpga(pga, 'E')).to.be.closeTo(1.1, EPSILON);
      expect(amp.getFpga(pga, 'D (default)')).to.be.closeTo(1.2, EPSILON);
    });

    it('computes properly when the input is interpolated', function () {
      var pga = 0.45;

      expect(amp.getFpga(pga, 'A')).to.be.closeTo(0.8, EPSILON);
      expect(amp.getFpga(pga, 'B (measured)')).to.be.closeTo(0.9, EPSILON);
      expect(amp.getFpga(pga, 'C')).to.be.closeTo(1.2, EPSILON);
      expect(amp.getFpga(pga, 'D (determined)')).to.be.closeTo(1.15, EPSILON);
      // expect(amp.getFpga(pga, 'E')).to.be.closeTo(1.3, EPSILON);
      expect(amp.getFpga(pga, 'D (default)')).to.be.closeTo(1.2, EPSILON);
    });
  });

  describe('Table Methods', function () {
    it('returns a DOM element', function () {
      var table;

      table = amp.getFaTable('0.1', 'A');
      expect(table).to.be.an.instanceOf(Node);
    });

    it('highlights the correct cells', function () {
      var lower,
          table,
          upper;

      table = amp.getFaTable(0.25, 'A');
      lower = table.querySelector('.lower');
      upper = table.querySelector('.upper');

      expect(lower).to.deep.equal(upper);
      expect(lower.innerHTML).to.equal('0.8');


      table = amp.getFaTable(1.6, 'B (measured)');
      lower = table.querySelector('.lower');
      upper = table.querySelector('.upper');

      expect(lower).to.deep.equal(upper);
      expect(lower.innerHTML).to.equal('0.9');


      table = amp.getFaTable(0.8, 'D (determined)');
      lower = table.querySelector('.lower');
      upper = table.querySelector('.upper');

      expect(lower.innerHTML).to.equal('1.2');
      expect(upper.innerHTML).to.equal('1.1');
    });
  });
});
