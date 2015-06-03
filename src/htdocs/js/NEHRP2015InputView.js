'use strict';

var LookupDataFactory = require('util/LookupDataFactory'),

    L = require('leaflet'),
    LocationControl = require('locationview/LocationControl'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    View = require('mvc/View'),
    Util = require('util/Util');

var _CALCULATION_MODE_INPUT = 'input',
    _CALCULATION_MODE_OUTPUT = 'output';

var NEHRP2015InputView = function (params) {
  var _this,
      _initialize,

      _collection,
      _destroyCollection,
      _map,
      _reportMap,
      _factory,
      _designCodeCollection,
      _designCodeEl,
      _riskCategoryCollection,
      _riskCategoryEl,
      _siteClassCollection,
      _siteClassEl,
      _titleEl,
      _locationControlInput,
      _marker,

      _buildForm,
      _buildCollectionSelectBoxes,
      _buildLocationControl,
      _onCalculationDeselect,
      _onCalculationSelect,
      _renderInputMode,
      _renderOutputMode,
      _resetDesignCodeCollection,
      _resetSiteClassCollection,
      _resetRiskCategoryCollection,
      _updateDesignCode,
      _updateLocation,
      _removeLocation,
      _updateSiteClass,
      _updateRiskCategory,
      _updateTitle;

  _this = View(params);

  _initialize = function (params) {
    params = params || {};

    // Three collections for the collection select boxes
    _designCodeCollection = Collection();
    _siteClassCollection = Collection();
    _riskCategoryCollection = Collection();

    // Update the Calculation model when an input new value is selected
    _designCodeCollection.on('select', _updateDesignCode);
    _siteClassCollection.on('select', _updateSiteClass);
    _riskCategoryCollection.on('select', _updateRiskCategory);

    _collection = params.collection;

    if (!_collection) {
      _collection = Collection([_this.model]);
      _destroyCollection = true;
    }

    if (!_collection.get(_this.model.get('id'))) {
      _collection.add(_this.model);
    }

    if (!_collection.getSelected()) {
      _collection.select(_this.model);
    }

    _collection.on('select', _onCalculationSelect);
    _collection.on('deselect', _onCalculationDeselect);

    // structure html
    _buildForm();
    _buildCollectionSelectBoxes();

    // Lookup data for collection select boxes
    _factory = LookupDataFactory({});
    _factory.whenReady(function () {
      _buildLocationControl();
      // Set bindings on _this.model and perform initial rendering
      _onCalculationSelect();
    });
  };


  _buildLocationControl = function () {
    var natgeo,
        natgeoOutput,
        input;

    // Input, map with LocationControl and zoom controls
    _map = L.map(_this.el.querySelector('.location-view-input'), {
      center: L.latLng(40.0, -100.0),
      zoom: 3
    });
    natgeo = L.tileLayer('http://server.arcgisonline.com' +
        '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');
    _locationControlInput = new LocationControl({
      includePointControl: true,
      includeCoordinateControl: true,
      includeGeocodeControl: true,
      includeGeolocationControl: true,
      el: _this.el.querySelector('.location-view-input')
    });
    _map.addLayer(natgeo);
    _map.addControl(_locationControlInput);


    // Output, map with marker and zoom controls
    _reportMap = L.map(_this.el.querySelector('.location-view-output'), {
      center: L.latLng(40.0, -100.0),
      zoom: 3
    });
    natgeoOutput = L.tileLayer('http://server.arcgisonline.com' +
        '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');
    _reportMap.addLayer(natgeoOutput);


    // set initial location
    input = _this.model.get('input');
    if (input.get('latitude') !== null && input.get('longitude') !== null) {
      // update the marker on the map
      _locationControlInput.setLocation({
        'latitude': input.get('latitude'),
        'longitude': input.get('longitude')
      });
      _marker = L.marker(L.latLng(input.get('latitude'), input.get('longitude')));
      _marker.addTo(_reportMap);
    }

    // bind to change on location, update hidden output map
    _locationControlInput.on('location', _updateLocation);
  };


  _buildForm = function () {

    _this.el.className = 'vertical input-view';
    _this.el.innerHTML =
        '<label for="report-title">Title</label>' +
        '<input type="text" name="title" id="report-title" class="report-title-input" ' +
          'placeholder="Untitled Report" />' +
        '<h1 class="report-title-output"></h1>' +
        '<div class="row">' +
          '<div class="column three-of-five">' +
            '<label for="location-view">Location</label>' +
            '<div id="location-view" class="location-view-input"></div>' +
            '<div class="location-view-output"></div>' +
          '</div>' +
          '<div class="column two-of-five">' +
            '<label for="design-code">Design Code</label>' +
            '<select name="design-code" id="design-code" class="design-code-input"></select>' +
            '<div class="design-code-output"></div>' +
            '<label for="site-class">Site Class</label>' +
            '<select name="site-class" id="site-class" class="site-class-input"></select>' +
            '<div class="site-class-output"></div>' +
            '<label for="risk-category">Risk Category</label>' +
            '<select name="risk-category" id="risk-category" class="risk-category-input"></select>' +
            '<div class="risk-category-output"></div>' +
          '</div>' +
        '</div>';

    // Update title on change
    _titleEl = _this.el.querySelector('#report-title');
    _titleEl.addEventListener('blur', _updateTitle);
  };

  _buildCollectionSelectBoxes = function () {

    // Save references to collection select boxes
    _designCodeEl = _this.el.querySelector('#design-code');
    _siteClassEl = _this.el.querySelector('#site-class');
    _riskCategoryEl = _this.el.querySelector('#risk-category');

    // design_code CollectionSelectBox
    CollectionSelectBox({
      collection: _designCodeCollection,
      el: _designCodeEl,
      includeBlankOption: true,
      format: function (model) {
        return model.get('name');
      }
    });

    // site_class CollectionSelectBox
    CollectionSelectBox({
      collection: _siteClassCollection,
      el: _siteClassEl,
      includeBlankOption: true,
      format: function (model) {
        return model.get('name');
      }
    });

    // risk_category CollectionSelectBox
    CollectionSelectBox({
      collection: _riskCategoryCollection,
      el: _riskCategoryEl,
      includeBlankOption: true,
      format: function (model) {
        return model.get('name');
      }
    });
  };

  _onCalculationDeselect = function () {
    var input;

    if (_this.model) {
      _this.model.off('change', 'render', _this);

      input = _this.model.get('input');
      if (input) {
        input.off('change', 'render', _this);
      }

      _this.model = null;
    }
  };

  _onCalculationSelect = function () {
    var input;

    _this.model = _collection.getSelected();

    if (_this.model) {
      _this.model.on('change', 'render', _this);

      input = _this.model.get('input');
      if (input) {
        input.on('change', 'render', _this);
      }

      _this.render();
    }
  };

  _resetDesignCodeCollection = function (ids) {
    if (typeof ids === 'undefined') {
      _designCodeCollection.reset(_factory.getAllDesignCodes());
    } else {
      _designCodeCollection.reset(_factory.getDesignCodes(ids));
    }
  };

  _resetSiteClassCollection = function (ids) {
    if (typeof ids === 'undefined') {
      _siteClassCollection.reset(_factory.getAllSiteClasses());
    } else {
      _siteClassCollection.reset(_factory.getSiteClasses(ids));
    }
  };

  _resetRiskCategoryCollection = function (ids) {
    if (typeof ids === 'undefined') {
      _riskCategoryCollection.reset(_factory.getAllRiskCategories());
    } else {
      _riskCategoryCollection.reset(_factory.getRiskCategories(ids));
    }
  };

  // update design_code in the model
  _updateDesignCode = function () {
    var input;

    if (_this.model) {
      input = _this.model.get('input');

      if (input) {
        input.set({
          'design_code': _designCodeCollection.getSelected().get('id')
        });
      }
    }
  };

  // update site_class in the model
  _updateSiteClass = function () {
    var input;

    if (_this.model) {
      input = _this.model.get('input');

      if (input) {
        input.set({
          'site_class': _siteClassCollection.getSelected().get('id')
        });
      }
    }
  };

  // update risk_category in the model
  _updateRiskCategory = function () {
    var input;

    if (_this.model) {
      input = _this.model.get('input');

      if (input) {
        input.set({
          'risk_category': _riskCategoryCollection.getSelected().get('id')
        });
      }
    }
  };

  // update title in the model
  _updateTitle = function () {
    var input;

    if (_this.model) {
      input = _this.model.get('input');

      if (input) {
        input.set({'title': _titleEl.value});
      }
    }
  };

  // update location on the map and in the model
  _updateLocation = function (e) {
    var input,
        location;

    location = e.location;

    if (_this.model &&
        location.latitude !== null && location.longitude !== null) {
      input = _this.model.get('input');

      if (input) {
        input.set({
          'latitude': location.latitude,
          'longitude': location.longitude
        });
      }

      // update location on output map
      if (_marker) {
        _marker.setLatLng(L.latLng(location.latitude, location.longitude));
        _reportMap.panTo(L.latLng(location.latitude, location.longitude));
      } else {
        _marker = L.marker(L.latLng(location.latitude, location.longitude));
        _marker.addTo(_reportMap);
      }
    }
  };

  // updates output view
  _renderOutputMode = function (model) {
    var title,
        titleEl,
        designCode,
        designCodeEl,
        latitude,
        longitude,
        siteClass,
        siteClassEl,
        riskCategory,
        riskCategoryEl;

    titleEl = _this.el.querySelector('.report-title-output');
    designCodeEl = _this.el.querySelector('.design-code-output');
    siteClassEl = _this.el.querySelector('.site-class-output');
    riskCategoryEl = _this.el.querySelector('.risk-category-output');

    latitude = model.get('latitude');
    longitude = model.get('longitude');

    title = model.get('title') || '';

    if (latitude !== null && longitude !== null) {
      title = title + '<small>(' + latitude + ', ' + longitude + ')</small>';

      // update marker position on map
      _updateLocation({location: {latitude: latitude, longitude: longitude}});
    } else if (_marker && _marker._map) {
      _marker._map.removeLayer(_marker);
      _marker = null;
    }

    // use factory to grab model
    designCode = _factory.getDesignCode(model.get('design_code'));
    siteClass = _factory.getSiteClass(model.get('site_class'));
    riskCategory = _factory.getRiskCategory(model.get('risk_category'));

    // Use name instead of id for display in output mode
    titleEl.innerHTML = (title !== '') ? title : 'No Title';
    designCodeEl.innerHTML = designCode ?
        designCode.get('name') : 'No Design Code';
    siteClassEl.innerHTML = siteClass ?
        siteClass.get('name') : 'No Site Class';
    riskCategoryEl.innerHTML = riskCategory ?
        riskCategory.get('name') : 'No Risk Category';

    // keeps the map from freaking out
    _reportMap.invalidateSize();
  };

  // updates input view
  _renderInputMode = function (model) {
    var design_code = null;

    if (model.get('title') === null) {
      _titleEl.value = '';
    } else {
      _titleEl.value = model.get('title');
    }

    if (model.get('design_code') === null) {
      _designCodeCollection.selectById('-1');
      // disable site_class & risk_category
      _siteClassEl.setAttribute('disabled', true);
      _riskCategoryEl.setAttribute('disabled', true);
    } else {
      // update design_code collection
      _designCodeCollection.selectById(model.get('design_code'));
      // update site_class and risk_category collections
      design_code = _factory.getDesignCode(model.get('design_code'));
      _resetSiteClassCollection(design_code.get('site_classes'));
      _resetRiskCategoryCollection(design_code.get('risk_categories'));
      // enable the now populated CollectionSelectBoxes
      _siteClassEl.removeAttribute('disabled');
      _riskCategoryEl.removeAttribute('disabled');
    }

    if (model.get('site_class') === null) {
      _siteClassCollection.selectById('-1');
    } else {
      _siteClassCollection.selectById(model.get('site_class'));
    }

    if (model.get('risk_category') === null) {
      _riskCategoryCollection.selectById('-1');
    } else {
      _riskCategoryCollection.selectById(model.get('risk_category'));
    }

    // keeps the map from freaking out
    _map.invalidateSize();
  };


  // Updates the view based on the model
  _this.render = function () {

    // load design_codes
    if (_designCodeCollection.data().length === 0) {
      _resetDesignCodeCollection();
    }

    if (_this.model.get('mode') === _CALCULATION_MODE_OUTPUT) {
      _this.el.classList.add('input-view-' + _CALCULATION_MODE_OUTPUT);
      _renderOutputMode(_this.model.get('input'));
    } else if (_this.model.get('mode') === _CALCULATION_MODE_INPUT) {
      _this.el.classList.remove('input-view-' + _CALCULATION_MODE_OUTPUT);
      _renderInputMode(_this.model.get('input'));
    }
  };

  /* Cleans up the view */
  _this.destroy = Util.compose(_this.destroy, function () {

    // Remove event bindings
    _onCalculationDeselect();
    _collection.off('select', _onCalculationSelect);
    _collection.off('deselect', _onCalculationDeselect);

    _designCodeCollection.off('select', _updateDesignCode);
    _siteClassCollection.off('select', _updateSiteClass);
    _riskCategoryCollection.off('select', _updateRiskCategory);
    _this.model.get('input').off('change', _this.render);
    _this.model.off('change', _this.render);
    _locationControlInput.off('location', _updateLocation);

    // remove event listeners
    _titleEl.removeEventListener('blur', _updateTitle);

    if (_destroyCollection) {
      _collection.destroy();
    }

    // variables
    _collection = null;
    _destroyCollection = null;
    _map = null;
    _factory = null;
    _designCodeCollection = null;
    _designCodeEl = null;
    _riskCategoryCollection = null;
    _riskCategoryEl = null;
    _siteClassCollection = null;
    _siteClassEl = null;
    _titleEl = null;
    _locationControlInput = null;
    _marker = null;

    // methods
    _buildForm = null;
    _buildCollectionSelectBoxes = null;
    _buildLocationControl = null;
    _onCalculationDeselect = null;
    _onCalculationSelect = null;
    _renderInputMode = null;
    _renderOutputMode = null;
    _resetDesignCodeCollection = null;
    _resetSiteClassCollection = null;
    _resetRiskCategoryCollection = null;
    _updateDesignCode = null;
    _updateLocation = null;
    _removeLocation = null;
    _updateSiteClass = null;
    _updateRiskCategory = null;
    _updateTitle = null;

    _initialize = null;
    _this = null;
  });



  _initialize(params);
  params = null;
  return _this;

};

module.exports = NEHRP2015InputView;
