'use strict';

var Collection = require('mvc/Collection'),

    Util = require('util/Util'),
    Xhr = require('util/Xhr');



var _DEFAULTS = {
  url: '/service.php',
  fetchData: true
};

var LookupDataFactory = function (params) {
  var _this,
      _initialize,

      _callbacks,
      _designCodes,
      _fetchData,
      _hazardBases,
      _isReady,
      _regions,
      _riskCategories,
      _siteClasses,

      _getAll,
      _onMetadataError,
      _onMetadataSuccess;


  _this = {
    getDesignCode: null,
    getDesignCodes: null,
    getHazardBasis: null,
    getHazardBases: null,
    getRegion: null,
    getRegions: null,
    getRiskCategory: null,
    getRiskCategories: null,
    getSiteClass: null,
    getSiteClasses: null
  };

  _initialize = function (params) {
    params = Util.extend({}, _DEFAULTS, params);

    _callbacks = [];
    _fetchData = params.fetchData;

    if (_fetchData) {
      _designCodes = Collection([]);
      _hazardBases = Collection([]);
      _regions = Collection([]);
      _riskCategories = Collection([]);
      _siteClasses = Collection([]);

      _isReady = false;

      Xhr.ajax({
        url: params.url,
        success: _onMetadataSuccess,
        error: _onMetadataError
      });
    } else {
      _designCodes = params.designCodes;
      _hazardBases = params.hazardBases;
      _regions = params.regions;
      _riskCategories = params.riskCategories;
      _siteClasses = params.siteClasses;

      _isReady = true;
    }
  };


  _getAll = function (collection, ids) {
    return collection.data().map(function (model) {
      return (ids.indexOf(model.get('id')) !== -1);
    });
  };

  _onMetadataError = function (/*status, xhr*/) {
    _isReady = true; // Well, not really, but we never will be...

    throw new Error('An error occurred fetching metadata information ' +
        'from server.');
  };

  _onMetadataSuccess = function (data/*, xhr*/) {
    _designCodes.reset(data.design_code);
    _hazardBases.reset(data.hazardBasis);
    _regions.reset(data.region);
    _riskCategories.reset(data.risk_category);
    _siteClasses.reset(data.site_class);

    _isReady = true;

    _callbacks.forEach(function (callback) {
      try {
        callback();
      } catch (e) {
        if (console && console.log) {
          console.log(e);
        }
      }
    });
  };


  _this.destroy = function () {
    if (_fetchData) {
      _designCodes.destroy();
      _hazardBases.destroy();
      _regions.destroy();
      _riskCategories.destroy();
      _siteClasses.destroy();
    }

    _designCodes = null;
    _hazardBases = null;
    _regions = null;
    _riskCategories = null;
    _siteClasses = null;

    _getAll = null;
    _onMetadataError = null;
    _onMetadataSuccess = null;

    _initialize = null;
    _this = null;
  };

  _this.getDesignCode = function (id) {
    return _designCodes.get(id);
  };

  _this.getDesignCodes = function (ids) {
    return _getAll(_designCodes, ids);
  };

  _this.getHazardBasis = function (id) {
    return _hazardBases.get(id);
  };

  _this.getHazardBases = function (ids) {
    return _getAll(_hazardBases, ids);
  };

  _this.getRegion = function (id) {
    return _regions.get(id);
  };

  _this.getRegions = function (ids) {
    return _getAll(_regions, ids);
  };

  _this.getRiskCategory = function (id) {
    return _riskCategories.get(id);
  };

  _this.getRiskCategories = function (ids) {
    return _getAll(_riskCategories, ids);
  };

  _this.getSiteClass = function (id) {
    return _siteClasses.get(id);
  };

  _this.getSiteClasses = function (ids) {
    return _getAll(_siteClasses, ids);
  };

  _this.whenReady = function (callback) {
    if (_isReady) {
      callback();
    } else {
      _callbacks.push(callback);
    }
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = LookupDataFactory;
