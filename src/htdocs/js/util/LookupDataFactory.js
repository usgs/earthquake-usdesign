'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),

    Util = require('util/Util'),
    Xhr = require('util/Xhr');



var _DEFAULTS = {
  url: 'usage.ws.php',
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
      _getSupported,
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


  _getAll = function (collection) {
    return collection.data().slice(0);
  };

  _getSupported = function (collection, ids) {
    return collection.data().map(function (model) {
      if (ids.indexOf(model.get('id')) !== -1) {
        return model;
      }
    });
  };

  _onMetadataError = function (/*status, xhr*/) {
    _isReady = true; // Well, not really, but we never will be...

    throw new Error('An error occurred fetching metadata information ' +
        'from server.');
  };

  _onMetadataSuccess = function (data/*, xhr*/) {
    _designCodes.reset(data.design_code.map(Model));
    _hazardBases.reset(data.hazard_basis.map(Model));
    _regions.reset(data.region.map(Model));
    _riskCategories.reset(data.risk_category.map(Model));
    _siteClasses.reset(data.site_class.map(Model));

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
    _getSupported = null;
    _onMetadataError = null;
    _onMetadataSuccess = null;

    _initialize = null;
    _this = null;
  };

  _this.getDesignCode = function (id) {
    return _designCodes.get(id);
  };

  _this.getDesignCodes = function (ids) {
    return _getSupported(_designCodes, ids);
  };

  _this.getAllDesignCodes = function () {
    return _getAll(_designCodes);
  };

  _this.getHazardBasis = function (id) {
    return _hazardBases.get(id);
  };

  _this.getHazardBases = function (ids) {
    return _getSupported(_hazardBases, ids);
  };

  _this.getAllHazardBases = function () {
    return _getAll(_hazardBases);
  };

  _this.getRegion = function (id) {
    return _regions.get(id);
  };

  _this.getRegions = function (ids) {
    return _getSupported(_regions, ids);
  };

  _this.getAllRegions = function () {
    return _getAll(_regions);
  };

  _this.getRiskCategory = function (id) {
    return _riskCategories.get(id);
  };

  _this.getRiskCategories = function (ids) {
    return _getSupported(_riskCategories, ids);
  };

  _this.getAllRiskCategories = function () {
    return _getAll(_riskCategories);
  };

  _this.getSiteClass = function (id) {
    return _siteClasses.get(id);
  };

  _this.getSiteClasses = function (ids) {
    return _getSupported(_siteClasses, ids);
  };

  _this.getAllSiteClasses = function () {
    return _getAll(_siteClasses);
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
