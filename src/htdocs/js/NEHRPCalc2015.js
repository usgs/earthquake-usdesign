'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util'),
    LookUpDataFactory = require('util/LookUpDataFactory'),
    SiteAmplification = require('util/SiteAmplification');

var _DEFAULTS = {

};

var NEHRPCalc2015 = function (params) {
  var _this,

      _initialize,
      _interpolateResults,
      _interpolateValue,
      _computeSds,
      _computeSd1,
      _siteAmplification,
      _computeSsuh,
      _computeS1uh,
      _computeSsur,
      _computeS1ur,
      _computeSsd,
      _computeS1d,
      _computeSs,
      _computeS1,
      _computeFa,
      _computeFv,
      _computeSms,
      _computeSm1,
      _computeFpga,
      _computePga,
      _computePgam,
      _computeSdSpectra,
      _computeSmSpectra,
      _lookUpDataFactory;

  _this = {};

  _initialize = function (params) {
    _siteAmplification = SiteAmplification();
    params = Util.extend({}, _DEFAULTS, params);

    _lookUpDataFactory = params.LookUpDataFactory;

    if (_lookUpDataFactory === null) {
      _lookUpDataFactory = new LookUpDataFactory();
    }
  };

  /**
   * Interpolates results
   */
  _interpolateResults = function (d0, d1, x, x0, x1) {
    var key,
        result;

    result = {};

    for (key in d0) {
      if (d0.hasOwnProperty(key) && d1.hasOwnProperty(key)) {
        result[key] =
            _interpolateValue(d0[key], d1[key], x, x0, x1);
      }
    }

    return result;
  };

  /**
   * Interpolates a single value
   */
  _interpolateValue = function (y0, y1, x, x0, x1) {
    return y0 + (((y1-y0)/(x1-x0))*(x-x0));
  };

  /**
   * Factor hazard value for max direction. Period 0.2
   */
  _computeSsuh = function (result) {
    var ssuh;

    ssuh = result.get('ssuh');

    if (ssuh === null) {
      ssuh = result.get('max_direction_ss') * result.get('mapped_ss');
      return result.set({
        'ssuh': ssuh
      });
    }
    return ssuh;
  };

  /**
   * Factor hazard value for max direction. Period 1.0
   */
  _computeS1uh = function (result) {
    var s1uh;

    s1uh = result.get('s1uh');

    if (s1uh === null) {
      s1uh = result.get('max_direction_s1') * result.get('mapped_s1');
      return result.set({
        's1uh': s1uh
      });
    }
    return s1uh;
  };
  /**
   * Convert uniform hazard to uniform risk. Period 0.2
   */
  _computeSsur = function (result) {
    return _computeSsuh() * result.get('crs');
  };

  /**
   * Convert uniform hazard to uniform risk. Period 1.0
   */
  _computeS1ur = function (result) {
    return _computeS1uh(result) * result.get('cr1');
  };

  /* Factor deterministic acceleration values Ssd.
   *  pgdv84 = 84th-Percentile Geomean Deterministic value
   *  maxD84 = Maximum Direction 84th-Percentile Deterministic value
   */
  _computeSsd = function (result) {
    var geomeanSsd,
        maxD84,
        pgdv84,
        ssd;

    ssd = result.get('ssd');
    if (ssd === null) {
      geomeanSsd = result.get('geomean_ssd');
      pgdv84 = result.get('percentil_ss') * geomeanSsd;
      maxD84 = result.get('max_direction_ss') * pgdv84;

      ssd = Math.max(maxD84, result.get('deterministic_floor_ss'));
      return result.set({
        'ssd': ssd
      });
    }
    return ssd;
  };

  /* Factor deterministic acceleration values Ssd.
   *  pgdv841 = 84th-Percentile Geomean Deterministic value
   *  maxD841 = Maximum Direction 84th-Percentile Deterministic value
   */
  _computeS1d = function (result) {
    var geomeanS1d,
        maxD841,
        pgdv841,
        s1d;

    s1d = result.get('s1d');
    if (s1d === null) {
      geomeanS1d = result.get('geomean_s1d');
      pgdv841 = result.get('percentil_s1') * geomeanS1d;
      maxD841 = result.get('max_direction_s1') * pgdv841;

      s1d = Math.max(maxD841, result.get('deterministic_floor_s1'));
      return result.set({
        's1d': s1d
      });
    }
    return s1d;
  };

  /**
   * Compare 0.2 risk-targeted probabilisic spectral acceleration
   * values with Ssd. Use minimuim value from each pair.
   */
  _computeSs = function (result) {
    var ss;

    ss = result.get('ss');

    if (ss === null) {
      ss = Math.min(_computeSsur(result), _computeSsd(result));
      return result.set({
        'ss': ss
      });
    }
    return ss;
  };

  /**
   * Compare 1.0 risk-targeted probabilisic spectral acceleration
   * values with S1d. Use minimuim value from each pair.
   */
  _computeS1 = function (result) {
    var s1;

    s1 = result.get('s1');

    if (s1 === null) {
      s1 = Math.min(_computeS1ur(result), _computeS1d(result));
      return result.set({
        's1': s1
      });
    }
    return s1;
  };

  /**
   * Uses SiteAmplification tables to get fa values.
   */
  _computeFa = function (result) {
    var fa,
        siteClass;

    fa = result.get('fa');
    siteClass = result.get('site_class');

    if (fa === null) {
      fa = _siteAmplification.getFa(_computeSs(result), siteClass);
      return result.set({
        'fa': fa
      });
    }
    return fa;
  };

  /**
   * Uses SiteAmplification tables to get fv values.
   */
  _computeFv = function (result) {
    var fv,
        siteClass;

    fv = result.get('fv');
    siteClass = result.get('site_class');

    if (fv === null) {
      fv = _siteAmplification.getFv(_computeS1(result), siteClass);
      return result.set({
        'fv': fv
      });
    }
  };

  /**
   * Site-adjusted MCEr spectral acceleration values Sms.
   */
  _computeSms = function (result) {
    var sms;

    sms = result.get('sms');

    if (sms === null) {
      sms = _computeFa(result) * _computeSs(result);
      return result.set({
        'sms': sms
      });
    }
    return sms;
  };

  /**
  * Site-adjusted MCEr spectral acceleration values Sm1.
  */
  _computeSm1 = function (result) {
    var sm1;

    sm1 = result.get('sm1');

    if (sm1 === null) {
      sm1 = _computeFv(result) * _computeS1(result);
      return result.set({
        'sm1': sm1
      });
    }
    return sm1;
  };

  /**
  * Multiply Sms by 2/3 to get the design value Sds.
  */
  _computeSds = function (result) {
    var sds;

    sds = result.get('sds');

    if (sds === null) {
      sds = (2/3) * _computeSms(result);
      return result.set({
        'sds': sds
      });
    }
    return sds;
  };

  /**
  * Multiply Sm1 by 2/3 to get the design value Sda
  */
  _computeSd1 = function (result) {
    var sd1;

    sd1 = result.get('sd1');

    if (sd1 === null) {
      sd1 = (2/3) * _computeSm1(result);
      return result.set({
        'sd1': sd1
      });
    }
    return sd1;
  };

  /**
   * Calculates the Probabilistic PGA and Deterministic PGA values to
   * get the PGA value.
   */
  _computePga = function (result) {
    var pga,
        probabilisticPga,
        deterministicPga;

    pga = result.get('pga');

    if (pga === null) {
      probabilisticPga = result.get('mapped_pga');
      deterministicPga = Math.max(result.get('geomean_pgad'),
          result.get('deterministic_flor_pga'));

      pga = Math.min(probabilisticPga, deterministicPga);
      return result.set({
        'pga': pga
      });
    }
    return pga;
  };

  /**
   * Fpga is pulled from a table in SiteAmplification and used to compute
   * the PGAm value.
   */
  _computeFpga = function (result) {
    var fpga,
        siteClass;

    fpga = result.get('fpga');
    siteClass = result.get('site_class');

    if (fpga === null) {
      fpga = _siteAmplification.getFpga(_computePga(result), siteClass);
      return result.set({
        'fpga': fpga
      });
    }
    return fpga;
  };

  /**
   * Fpga is used to compute the Pgam value.
   */
  _computePgam = function (result) {
    var pgam;

    pgam = result.get('pgam');

    if (pgam === null) {
      pgam = _computeFpga(result) * _computePga(result);
      return result.set({
        'pgam': pgam
      });
    }
    return pgam;
  };

  _computeSdSpectra = function (result) {
    var sdSpectra,
        tn,
        t1,
        tl,
        i,
        sds,
        sd1,
        tHat;

    sds =_computeSds(result);
    sd1 = _computeSd1(result);

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
    return result.set({
      'sdSpectra': sdSpectra
    });
  };

  _computeSmSpectra = function (result) {
    var smSpectra,
        tn,
        t1,
        tl,
        i,
        sms,
        sm1,
        tHat;

    sms =_computeSms(result);
    sm1 = _computeSm1(result);

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
    return result.set({
      'smSpectra': smSpectra
    });
  };

  _this.calculate = function (calculation) {
    var input,
        metadata,
        output,
        result,
        siteClass;

    output = calculation.get('output');
    input = calculation.get('input');
    metadata = output.get('metadata');
    result = _this.interpolate(calculation);
    siteClass = input.get('site_class');

    siteClass = LookUpDataFactory.getSiteClass(siteClass);

    result.set({
      'site_class': siteClass
    });

    result.set(metadata.get());
    _computeSsuh(result);
    _computeS1uh(result);

    _computeSsd(result);
    _computeS1d(result);

    _computeSs(result);
    _computeS1(result);

    _computeSms(result);
    _computeSm1(result);

    _computeSds(result);
    _computeSd1(result);

    _computePga(result);
    _computePgam(result);

    return calculation.set({
      'result': result
    });
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
        output,
        result,
        resultLat1,
        resultLat3;

    input = calculation.get('input');
    output = calculation.get('output');
    data = output.get('data').data();
    latInput = input.get('latitude');
    lngInput = input.get('longitude');

    if (data.length === 1) {
      result = Util.extend({}, data[0].get());

    } else if (data.length === 2) {
      lat1 = data[0].get('latitude');
      lat2 = data[1].get('latitude');
      lng1 = data[0].get('longitude');
      lng2 = data[1].get('longitude');

      if (lat1 === lat2) {
        result = _interpolateResults(
            data[0].get(),
            data[1].get(),
            lngInput,
            lng1,
            lng2);

      } else if (lng1 === lng2) {
        result = _interpolateResults(
            data[0].get(),
            data[1].get(),
            latInput,
            lat1,
            lat2);

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

      resultLat1 = _interpolateResults(
          data[0].get(),
          data[1].get(),
          lngInput,
          lng1,
          lng2);

      resultLat3 = _interpolateResults(
          data[0].get(),
          data[1].get(),
          lngInput,
          lng3,
          lng4);

      result = _interpolateResults(
          resultLat1,
          resultLat3,
          latInput,
          lat1,
          lat3);

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