'use strict';

var _siteAmplificationHeader,
    _siteAmplificationValue;


_siteAmplificationHeader = function (value) {
  return parseFloat(value).toFixed(2);
};

_siteAmplificationValue = function (value) {
  return parseFloat(value).toFixed(1);
};


var Formatter = {
  siteAmplificationHeader: _siteAmplificationHeader,
  siteAmplificationValue: _siteAmplificationValue
};


module.exports = Formatter;
