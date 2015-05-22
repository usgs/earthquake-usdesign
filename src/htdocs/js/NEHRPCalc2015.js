'use strict';

var NEHRPCalc2015 = function () {
  var //_this,

      Interpolate,
      getInterpolateValue,
      getData;

  // _this.getSsuh = function (calculation) {
  //   var mappedSs = _this.getMappedSs(calculation),
  //       maxDirectionSs = _this.getMaxDirectionSs(calculation);
  //       return mappedSs * maxDirectionSs;
  // };


  // _this.getMappedSs = function (calculation) {
  // };

  Interpolate = function (calculation) {
    var data,
        results,
        mapped_ss,
        crs,
        geomean_ssd,
        mapped_s1,
        cr1,
        geomean_s1d,
        mapped_pga,
        geomean_pgad,
        dataAttributes,
          value1, value2, value3, value4,
          latInput, lngInput,
          lat1, lat2, lat3,
          lng1, lng2, lng3, lng4,
          valueP1P2, valueP3P4,
          i;

    data = calculation.get('output').get('data').data();

    if (data.length ===1) {
      latInput = calculation.get('input').get('latitude');
      lngInput = calculation.get('input').get('longitude');
      mapped_ss = calculation.get('data').get('mapped_ss');
      crs = calculation.get('data').get('crs');
      geomean_ssd = calculation.get('data').get('geomean_ssd');
      mapped_s1 = calculation.get('data').get('mapped_s1');
      cr1 = calculation.get('data').get('cr1');
      geomean_s1d = calculation.get('data').get('geomean_s1d');
      mapped_pga = calculation.get('data').get('mapped_pga');
      geomean_pgad = calculation.get('data').get('geomean_pgad');

      results = [
        {
          'latitude': latInput,
          'longitude': lngInput,

          'mapped_ss': mapped_ss,
          'crs': crs,
          'geomean_ssd': geomean_ssd,

          'mapped_s1': mapped_s1,
          'cr1': cr1,
          'geomean_s1d': geomean_s1d,

          'mapped_pga': mapped_pga,
          'geomean_pgad': geomean_pgad
        }
      ];

      return results;
    } else if (data.length === 2) {
      lat1 = data[0].get('latitude');
      lat2 = data[1].get('latitude');
      lng1 = data[0].get('longitude');
      lng2 = data[1].get('longitude');

      if (lat1 === lat2) {

        } else if (lng1 === lng2) {
        } else {
        //Lat and lng don't match throw error
        }
    } else if (data.length === 4) {
      // var dataAttributes,
      //     value1, value2, value3, value4,
      //     latInput, lngInput,
      //     lat1, lat3,
      //     lng1, lng2, lng3, lng4,
      //     valueP1P2, valueP3P4;

      dataAttributes = calculation.get('output').get('data');

      for (i = 0; dataAttributes.length < i; i++) {
        value1 = data[0].get(dataAttributes[i]);
        value2 = data[1].get(dataAttributes[i]);
        value3 = data[2].get(dataAttributes[i]);
        value4 = data[3].get(dataAttributes[i]);

        latInput = calculation.get('input').get('latitude');
        lngInput = calculation.get('input').get('longitude');

        lat1 = data[0].get('latitude');
        lat3 = data[2].get('latitude');

        lng1 = data[0].get('longitude');
        lng2 = data[1].get('longitude');
        lng3 = data[2].get('longitude');
        lng4 = data[3].get('longitude');

        valueP1P2 = getInterpolateValue(value1, value2, lngInput, lng1, lng2);
        valueP3P4 = getInterpolateValue(value3, value4, lngInput, lng3, lng4);

        dataAttributes[i] =
            getInterpolateValue(valueP1P2, valueP3P4, latInput, lat1, lat3);

        results = [
          {
            'latitude': latInput,
            'longitude': lngInput,

            'mapped_ss': mapped_ss,
            'crs': crs,
            'geomean_ssd': geomean_ssd,

            'mapped_s1': mapped_s1,
            'cr1': cr1,
            'geomean_s1d': geomean_s1d,

            'mapped_pga': mapped_pga,
            'geomean_pgad': geomean_pgad
          }
        ];
      }
      return results;
    } else {
      //Does not have 1,2,4 points error
    }

  };

  getInterpolateValue = function (y0, y1, x, x0, x1) {
    return y0 + (((y1-y0)/(x1-x0))*(x-x0));
  };

  getData = function (calculation) {
    return calculation.get('output').get('data');
  };
};

module.export = NEHRPCalc2015;