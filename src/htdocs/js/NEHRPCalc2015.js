'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util'),

    LookupDataFactory = require('util/LookupDataFactory'),
    SiteAmplification = require('util/SiteAmplification');

var _DEFAULTS = {

};

var NEHRPCalc2015 = function (params) {
  var _this,
      _initialize,

      _lookupDataFactory,
      _siteAmplification;

  _this = {};

  _initialize = function (params) {
    _siteAmplification = SiteAmplification();
    params = Util.extend({}, _DEFAULTS, params);

    _lookupDataFactory = params.lookupDataFactory;

    if (!_lookupDataFactory) {
      _lookupDataFactory = LookupDataFactory();
    }
  };

  /**
   * Interpolates results
   */
  _this.interpolateResults = function (d0, d1, x, x0, x1) {
    var key,
        result;

    result = {};

    for (key in d0) {
      if (d0.hasOwnProperty(key) && d1.hasOwnProperty(key)) {
        result[key] =
            _this.interpolateValue(d0[key], d1[key], x, x0, x1);
      }
    }
    return result;
  };

  /**
   * Interpolates a single value
   */
  _this.interpolateValue = function (y0, y1, x, x0, x1, log) {
    var value;

    if (log === 'linearlog') {
      if (y0 === 0 || y1 === 0) {
        throw new Error('Can not get the log of 0 Y values.');
      } else {
        y0 = Math.log(y0);
        y1 = Math.log(y1);
        value = Math.exp(y0 + (((y1-y0)/(x1-x0))*(x-x0)));
      }
    } else {
      value = y0 + (((y1-y0)/(x1-x0))*(x-x0));
    }
    return value;
  };

  /**
   * Factor hazard value for max direction. Period 0.2
   */
  _this.getSsuh = function (calculation) {
    var metadata,
        result,
        ssuh;

    result = _this.getResult(calculation);
    ssuh = result.get('ssuh');
    if (ssuh === null) {
      metadata = calculation.get('output').get('metadata');
      ssuh = metadata.get('max_direction_ss') * result.get('mapped_ss');

      result.set({
        'ssuh': ssuh
      });
    }
    return ssuh;
  };

  /**
   * Factor hazard value for max direction. Period 1.0
   */
  _this.getS1uh = function (calculation) {
    var metadata,
        result,
        s1uh;

    result = _this.getResult(calculation);
    s1uh = result.get('s1uh');

    if (s1uh === null) {
      metadata = calculation.get('output').get('metadata');
      s1uh = metadata.get('max_direction_s1') * result.get('mapped_s1');

      result.set({
        's1uh': s1uh
      });
    }
    return s1uh;
  };
  /**
   * Convert uniform hazard to uniform risk. Period 0.2
   */
  _this.getSsur = function (calculation) {
    var result;

    result = _this.getResult(calculation);

    return _this.getSsuh(calculation) * result.get('crs');
  };

  /**
   * Convert uniform hazard to uniform risk. Period 1.0
   */
  _this.getS1ur = function (calculation) {
    var result;

    result = _this.getResult(calculation);

    return _this.getS1uh(calculation) * result.get('cr1');
  };

  /* Factor deterministic acceleration values Ssd.
   *  pgdv84 = 84th-Percentile Geomean Deterministic value
   *  maxD84 = Maximum Direction 84th-Percentile Deterministic value
   */
  _this.getSsd = function (calculation) {
    var geomeanSsd,
        maxD84,
        metadata,
        pgdv84,
        result,
        ssd;

    result = _this.getResult(calculation);
    ssd = result.get('ssd');
    if (ssd === null) {
      metadata = calculation.get('output').get('metadata');
      geomeanSsd = result.get('geomean_ssd');
      pgdv84 = metadata.get('percentile_ss') * geomeanSsd;
      maxD84 = metadata.get('max_direction_ss') * pgdv84;

      ssd = Math.max(maxD84, metadata.get('deterministic_floor_ss'));
      result.set({
        'ssd': ssd
      });
    }
    return ssd;
  };

  /* Factor deterministic acceleration values Ssd.
   *  pgdv841 = 84th-Percentile Geomean Deterministic value
   *  maxD841 = Maximum Direction 84th-Percentile Deterministic value
   */
  _this.getS1d = function (calculation) {
    var geomeanS1d,
        maxD841,
        metadata,
        pgdv841,
        result,
        s1d;

    result = _this.getResult(calculation);
    s1d = result.get('s1d');
    if (s1d === null) {
      metadata = calculation.get('output').get('metadata');
      geomeanS1d = result.get('geomean_s1d');
      pgdv841 = metadata.get('percentil_s1') * geomeanS1d;
      maxD841 = metadata.get('max_direction_s1') * pgdv841;

      s1d = Math.max(maxD841, metadata.get('deterministic_floor_s1'));
      result.set({
        's1d': s1d
      });
    }
    return s1d;
  };

  /**
   * Compare 0.2 risk-targeted probabilisic spectral acceleration
   * values with Ssd. Use minimuim value from each pair.
   */
  _this.getSs = function (calculation) {
    var result,
        ss;

    result = _this.getResult(calculation);
    ss = result.get('ss');

    if (ss === null) {
      ss = Math.min(_this.getSsur(calculation),
          _this.getSsd(calculation));
      result.set({
        'ss': ss
      });
    }
    return ss;
  };

  /**
   * Compare 1.0 risk-targeted probabilisic spectral acceleration
   * values with S1d. Use minimuim value from each pair.
   */
  _this.getS1 = function (calculation) {
    var result,
        s1;

    result = _this.getResult(calculation);
    s1 = result.get('s1');

    if (s1 === null) {
      s1 = Math.min(_this.getS1ur(calculation),
          _this.getS1d(calculation));
      result.set({
        's1': s1
      });
    }
    return s1;
  };

  /**
   * Uses SiteAmplification tables to get fa values.
   */
  _this.getFa = function (calculation) {
    var fa,
        result,
        siteClass;

    result = _this.getResult(calculation);
    fa = result.get('fa');


    if (fa === null) {
      siteClass = _this.getSiteClass(calculation);
      fa = _siteAmplification.getFa(_this.getSs(calculation), siteClass);
      result.set({
        'fa': fa
      });
    }
    return fa;
  };

  /**
   * Uses SiteAmplification tables to get fv values.
   */
  _this.getFv = function (calculation) {
    var fv,
        result,
        siteClass;

    result = _this.getResult(calculation);
    fv = result.get('fv');

    if (fv === null) {
      siteClass = _this.getSiteClass(calculation);
      fv = _siteAmplification.getFv(_this.getS1(calculation), siteClass);
      result.set({
        'fv': fv
      });
    }
    return fv;
  };

  /**
   * Site-adjusted MCEr spectral acceleration values Sms.
   */
  _this.getSms = function (calculation) {
    var result,
        sms;

    result = _this.getResult(calculation);
    sms = result.get('sms');

    if (sms === null) {
      sms = _this.getFa(calculation) * _this.getSs(calculation);
      result.set({
        'sms': sms
      });
    }
    return sms;
  };

  /**
  * Site-adjusted MCEr spectral acceleration values Sm1.
  */
  _this.getSm1 = function (calculation) {
    var result,
        sm1;

    result = _this.getResult(calculation);
    sm1 = result.get('sm1');

    if (sm1 === null) {
      sm1 = _this.getFv(calculation) * _this.getS1(calculation);
      result.set({
        'sm1': sm1
      });
    }
    return sm1;
  };

  /**
  * Multiply Sms by 2/3 to get the design value Sds.
  */
  _this.getSds = function (calculation) {
    var result,
        sds;

    result = _this.getResult(calculation);
    sds = result.get('sds');

    if (sds === null) {
      sds = (2/3) * _this.getSms(calculation);
      result.set({
        'sds': sds
      });
    }
    return sds;
  };

  /**
  * Multiply Sm1 by 2/3 to get the design value Sda
  */
  _this.getSd1 = function (calculation) {
    var result,
        sd1;

    result = _this.getResult(calculation);
    sd1 = result.get('sd1');

    if (sd1 === null) {
      sd1 = (2/3) * _this.getSm1(calculation);
      result.set({
        'sd1': sd1
      });
    }
    return sd1;
  };

  /**
   * Calculates the Probabilistic PGA and Deterministic PGA values to
   * get the PGA value.
   */
  _this.getPga = function (calculation) {
    var deterministicPga,
        metadata,
        pga,
        probabilisticPga,
        result;

    result = _this.getResult(calculation);
    pga = result.get('pga');

    if (pga === null) {
      metadata = calculation.get('output').get('metadata');
      probabilisticPga = result.get('mapped_pga');
      deterministicPga = Math.max(result.get('geomean_pgad'),
          metadata.get('deterministic_flor_pga'));

      pga = Math.min(probabilisticPga, deterministicPga);
      result.set({
        'pga': pga
      });
    }
    return pga;
  };

  /**
   * Fpga is pulled from a table in SiteAmplification and used to get
   * the PGAm value.
   */
  _this.getFpga = function (calculation) {
    var fpga,
        result,
        siteClass;

    result = _this.getResult(calculation);
    fpga = result.get('fpga');

    if (fpga === null) {
      siteClass = _this.getSiteClass(calculation);
      fpga = _siteAmplification.getFpga(_this.getPga(calculation),
          siteClass);
      result.set({
        'fpga': fpga
      });
    }
    return fpga;
  };

  /**
   * Fpga is used to get the Pgam value.
   */
  _this.getPgam = function (calculation) {
    var pgam,
        result;

    result = _this.getResult(calculation);
    pgam = result.get('pgam');

    if (pgam === null) {
      pgam = _this.getFpga(calculation) * _this.getPga(calculation);
      result.set({
        'pgam': pgam
      });
    }
    return pgam;
  };

  _this.getSdSpectra = function (calculation) {
    var i,
        result,
        sd1,
        sds,
        sdSpectra,
        t1,
        tHat,
        tl,
        tn;

    result = _this.getResult(calculation);
    sds =_this.getSds(calculation);
    sd1 = _this.getSd1(calculation);

    tl = result.get('tl');
    sdSpectra = [];
    i = 0;
    t1 = sd1 / sds;

    sdSpectra.push([0, 0.4 * sds]);
    sdSpectra.push([0.2 * t1, sds]);
    sdSpectra.push([t1, sds]);

    tHat = +(t1.toFixed(1));

    while (tn < 2.0) {
      tn = (0.1 * i) + tHat;
      sdSpectra.push([ tn, sds/tn]);
      i += 1;
    }
    result.set({
      'sdSpectra': sdSpectra
    });
    return sdSpectra;
  };

  _this.getSmSpectra = function (calculation) {
    var i,
        result,
        sm1,
        sms,
        smSpectra,
        t1,
        tHat,
        tl,
        tn;

    result = _this.getResult(calculation);
    sms = _this.getSms(calculation);
    sm1 = _this.getSm1(calculation);

    tl = result.get('tl');
    smSpectra = [];
    i = 0;
    t1 = sm1 / sms;

    smSpectra.push([0, 0.4 * sms]);
    smSpectra.push([0.2 * t1, sms]);
    smSpectra.push([t1, sms]);

    tHat = +(t1.toFixed(1));

    while (tn < 2.0) {
      tn = (0.1 * i) + tHat;
      smSpectra.push([ tn, sms/tn]);
      i += 1;
    }
    result.set({
      'smSpectra': smSpectra
    });
    return smSpectra;
  };

  _this.getResult = function (calculation) {
    var result;

    result = calculation.get('result');
    if (result === null) {
      result = _this.interpolate(calculation);
      calculation.set({
        'result': result
      });
    }
    return result;
  };

  _this.getSiteClass = function (calculation) {
    var input,
        result,
        siteClass;

    result = _this.getResult(calculation);
    siteClass = result.get('site_class');

    if (siteClass === null) {
      input = calculation.get('input');
      siteClass = input.get('site_class');
      siteClass = _lookupDataFactory.getSiteClass(siteClass).get('value');
      result.set({
        'site_class': siteClass
      });
    }
    return siteClass;
  };

  _this.calculate = function (calculation) {
    var result;

    result = _this.getResult(calculation);

    _this.getSsuh(calculation);
    _this.getS1uh(calculation);

    _this.getSsd(calculation);
    _this.getS1d(calculation);

    _this.getSs(calculation);
    _this.getS1(calculation);

    _this.getSms(calculation);
    _this.getSm1(calculation);

    _this.getSds(calculation);
    _this.getSd1(calculation);

    _this.getPga(calculation);
    _this.getPgam(calculation);

    return result;
  };

  _this.destroy = function () {
    _lookupDataFactory = null;
    _siteAmplification = null;
    _initialize = null;
    _this = null;
  };

  _this.interpolate = function (calculation) {
    var data,
        input,
        lat1,
        lat2,
        lat3,
        lng1,
        lng2,
        lng3,
        lng4,
        latInput,
        lngInput,
        log,
        metadata,
        output,
        result,
        resultLat1,
        resultLat3;

    input = calculation.get('input');
    output = calculation.get('output');
    data = output.get('data').data();
    latInput = input.get('latitude');
    lngInput = input.get('longitude');
    metadata = calculation.get('output').get('metadata');
    log = metadata.get('interpolation_method');

    if (data.length === 1) {
      result = Util.extend({}, data[0].get());

    } else if (data.length === 2) {
      lat1 = data[0].get('latitude');
      lat2 = data[1].get('latitude');
      lng1 = data[0].get('longitude');
      lng2 = data[1].get('longitude');

      if (lat1 === lat2) {
        result = _this.interpolateResults(
            data[0].get(),
            data[1].get(),
            lngInput,
            lng1,
            lng2,
            log);

      } else if (lng1 === lng2) {
        result = _this.interpolateResults(
            data[0].get(),
            data[1].get(),
            latInput,
            lat1,
            lat2,
            log);

      } else {
        throw new Error('Lat or Lng don\'t match and only 2 data points');
      }
    } else if (data.length === 4) {
      lat1 = data[0].get('latitude');
      lat3 = data[2].get('latitude');

      lng1 = data[0].get('longitude');
      lng2 = data[1].get('longitude');
      lng3 = data[2].get('longitude');
      lng4 = data[3].get('longitude');

      resultLat1 = _this.interpolateResults(
          data[0].get(),
          data[1].get(),
          lngInput,
          lng1,
          lng2,
          log);

      resultLat3 = _this.interpolateResults(
          data[0].get(),
          data[1].get(),
          lngInput,
          lng3,
          lng4,
          log);

      result = _this.interpolateResults(
          resultLat1,
          resultLat3,
          latInput,
          lat1,
          lat3,
          log);

    } else {
      throw new Error('Does not have 1, 2, or 4 points.');
    }

    return Model(result);
  };

  _initialize(params);
  params = null;
  return _this;

};

module.exports = NEHRPCalc2015;