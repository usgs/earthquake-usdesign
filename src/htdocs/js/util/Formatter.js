'use strict';

var _latitude,
    _longitude,
    _number,
    _siteAmplificationHeader,
    _siteAmplificationValue,
    _value;


_latitude = function (value) {
  var units;

  value = parseFloat(value);

  if (value === null || isNaN(value)) {
    return _value(null);
  } else {
    if (value < 0) {
      value *= -1.0;
      units = '&deg; S';
    } else {
      units = '&deg; N';
    }

    return _number(value, 3) + units;
  }
};

_longitude = function (value) {
  var units;

  value = parseFloat(value);

  if (value === null || isNaN(value)) {
    return _value(null);
  } else {
    if (value < 0) {
      value *= -1.0;
      units = '&deg; W';
    } else {
      units = '&deg; E';
    }

    return _number(value, 3) + units;
  }
};

_number = function (value, decimals) {
  return value.toFixed(decimals);
};

_siteAmplificationHeader = function (value) {
  return parseFloat(value).toFixed(2);
};

_siteAmplificationValue = function (value) {
  return parseFloat(value).toFixed(1);
};

_value = function (value) {
  if (value === null) {
    return '&ndash;';
  } else {
    return value;
  }
};


var Formatter = {
  latitude: _latitude,
  longitude: _longitude,
  number: _number,
  siteAmplificationHeader: _siteAmplificationHeader,
  siteAmplificationValue: _siteAmplificationValue,
  value: _value
};


module.exports = Formatter;
