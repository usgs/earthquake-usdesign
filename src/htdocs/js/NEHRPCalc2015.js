'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');


var NEHRPCalc2015 = function () {
  var _this,

      _interpolateResults,
      _interpolateValue;

  _this = {};

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
        maxD84,
        maxD841,
        metadata,
        output,
        pgdv84,
        pgdv841,
        result,
        s1,
        s1d,
        s1uh,
        s1ur,
        ss,
        ssd,
        ssuh,
        ssur;

    output = calculation.get('output');
    metadata = output.get('metadata');
    result = _this.interpolate(calculation);
    data = output.get('data').data();

    // factor hazard value for max direction
    ssuh = metadata.get('max_direction_ss') * output.get('mapped_ss');
    s1uh = metadata.get('max_direction_s1') * output.get('mapped_s1');

    // convert uniform hazard to uniform risk
    ssur = ssuh * data.get('crs');
    s1ur = s1uh * data.get('cr1');

    // Factor deterministic acceleratin values Ssd and S1d
    //84th-Percentile geomean Deterministic value
    pgdv84 = metadata.get('percentil_ss') * data.get('geomean_ssd');
    pgdv841 = metadata.get('percentil_s1') * data.get('geomean_s1d');
    //Maximum Direction 84th-Percentile Deterministic
    maxD84 = metadata.get('max_direction_ss') * pgdv84;
    maxD841 = metadata.get('max_direction_s1') * pgdv841;
    //Ssd & S1d MAX value
    ssd = Math.max(maxD84, metadata.get('deterministic_floor_ss'));
    s1d = Math.max(maxD841, metadata.get('deterministic_floor_s1'));


    //Compare 0.2 and 1.0 risk-rargeted probabilisic spectral acceleration
    //values with Ssd and S1d. Use minimuim value from each pair.
    ss = Math.min(ssur, ssd);
    s1 = Math.min(s1ur, s1d);


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

};

module.export = NEHRPCalc2015;