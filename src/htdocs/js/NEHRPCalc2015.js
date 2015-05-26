'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util'),

    SiteAmplification = require('util/SiteAmplification');


var NEHRPCalc2015 = function () {
  var _this,

      _initialize,
      _interpolateResults,
      _interpolateValue,
      _siteAdjusted,
      _siteAdjusted1,
      _siteAmplification;

  _this = {};

  _initialize = function () {
    _siteAmplification = SiteAmplification;
  };


  _siteAdjusted = function (siteClass, acceleration, table) {
    var fa,
        fv,
        fpga;

    if (table === 0) {
      fa = _siteAmplification.getFa(acceleration, siteClass);
      return fa * acceleration;
    } else if (table === 1) {
      fv = _siteAmplification.getFv(acceleration, siteClass);
      return fv * acceleration;
    } else if (table === 2) {
      fpga = _siteAmplification.getFpga(acceleration, siteClass);
      return fpga * pga;
    }

  };


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

  _interpolateValue = function (y0, y1, x, x0, x1) {
    return y0 + (((y1-y0)/(x1-x0))*(x-x0));
  };

  _this.calculate = function (calculation) {
    var data,
        deterministicPga,
        cr1,
        crs,
        geomean_s1d,
        geomean_ssd,
        input,
        mapped_s1,
        mapped_ss,
        maxD84,
        maxD841,
        metadata,
        output,
        pga,
        pgam,
        pgdv84,
        pgdv841,
        probabilisticPga,
        result,
        s1,
        s1d,
        s1uh,
        s1ur,
        sds,
        sd1,
        siteClass,
        sms,
        sm1,
        ss,
        ssd,
        ssuh,
        ssur;

    input = calculation.get('input');
    output = calculation.get('output');
    metadata = output.get('metadata');
    result = _this.interpolate(calculation);
    data = output.get('data').data();
    siteClass = input.get('site_class');

    // Determin Uniform Hazard (2% in 50-year) Ground motion values for periods
    // of 0.2s and 1.0s.
    mapped_ss = output.get('mapped_ss');
    mapped_s1 = output.get('mapped_s1');

    // factor hazard value for max direction.
    ssuh = metadata.get('max_direction_ss') * mapped_ss;
    s1uh = metadata.get('max_direction_s1') * mapped_s1;

    // crs values
    crs = data.get('crs');
    cr1 = data.get('cr1');
    // convert uniform hazard to uniform risk.
    ssur = ssuh * crs;
    s1ur = s1uh * cr1;

    // Factor deterministic acceleratin values Ssd and S1d.
    // Median geomean deterministic value.
    geomean_ssd = data.get('geomean_ssd');
    geomean_s1d = data.get('geomean_s1d');
    // 84th-Percentile geomean Deterministic value.
    pgdv84 = metadata.get('percentil_ss') * geomean_ssd;
    pgdv841 = metadata.get('percentil_s1') * geomean_s1d;
    // Maximum Direction 84th-Percentile Deterministic
    maxD84 = metadata.get('max_direction_ss') * pgdv84;
    maxD841 = metadata.get('max_direction_s1') * pgdv841;
    // Ssd & S1d MAX value
    ssd = Math.max(maxD84, metadata.get('deterministic_floor_ss'));
    s1d = Math.max(maxD841, metadata.get('deterministic_floor_s1'));


    // Compare 0.2 and 1.0 risk-rargeted probabilisic spectral acceleration
    // values with Ssd and S1d. Use minimuim value from each pair.
    ss = Math.min(ssur, ssd);
    s1 = Math.min(s1ur, s1d);

    // Site-adjusted MCEr spectral acceleration values Sms and Sm1
    sms = _siteAdjusted(siteClass, ss, 0);
    sm1 = _siteAdjusted1(siteClass, s1, 1);

    // Multiply Sms and Sm1 by 2/3 to get the design values Sds and Sd1
    sds = (2/3) * sms;
    sd1 = (2/3) * sm1;

    // Calculate Probabilistic PGA value
    probabilisticPga = data.get('mapped_pga');

    // Calculate Deterministic PGA value
    deterministicPga = Math.max(data.get('geomean_pgad'),
        output.get('deterministic_flor_pga'));

    // Calculate PGA value
    pga = Math.min(probabilisticPga, deterministicPga);

    // Calculate PGAm (Modified for site class)
    pgam = _siteAdjusted(siteClass, pga, 2);

    return result.set({
      'mapped_ss': mapped_ss,
      'mapped_s1': mapped_s1,
      'ssuh': ssuh,
      's1uh': s1uh,
      'crs': crs,
      'cr1': cr1,
      'ssur': ssur,
      's1ur': s1ur,
      'geomean_ssd': geomean_ssd,
      'geomean_s1d': geomean_s1d,
      'pgdv84': pgdv84,
      'pgdv841': pgdv841,
      'maxD84': maxD84,
      'maxD841': maxD841,
      'ssd': ssd,
      's1d': s1d,
      'ss': ss,
      's1': s1,
      'sms': sms,
      'sm1': sm1,
      'sds': sds,
      'sd1': sd1,
      'probabilisticPga': probabilisticPga,
      'deterministicPga': deterministicPga,
      'pga': pga,
      'pgam': pgam
    });

  };

  _this.interpolate = function (calculation) {
    var data,
        latInput, lngInput,
        lat1, lat2, lat3,
        lng1, lng2, lng3, lng4,
        input,
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
        throw new Error('Lat and lng don\'t match and only 2 data points');
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

  _initialize();
  return _this;

};

module.export = NEHRPCalc2015;