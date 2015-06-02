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

/**
 * This is a view that displays the the input object from the
 * Calculation model, and also creates inputs to edit these values.
 *
 * The NEHRP2015InputView expects an object with the following parameters:
 *
 * @param el {Object} HTML element that is used to display the view
 *
 *        el: document.querySelector('div')
 *
 * @param model {Object} [optional] A Calculation object. 
 *
 *        model: Calculation({
 *          mode: 'input',
 *          input: {
 *            'title': 'My First Report',
 *            'latitude': 45,
 *            'longitude': -70.1,
 *            'design_code': 1,
 *            'site_class': 2,
 *            'risk_category': 2
 *          }
 *        })
 */
var NEHRP2015InputView = function (params) {
  var _this,
      _initialize,

      _designCodeCollection,
      _designCodeEl,
      _factory,
      _inputMap,
      _locationControlInput,
      _marker,
      _outputMap,
      _riskCategoryCollection,
      _riskCategoryEl,
      _siteClassCollection,
      _siteClassEl,
      _titleEl,

      _buildCollectionSelectBoxes,
      _buildForm,
      _buildLocationControl,
      _renderInputMode,
      _renderOutputMode,
      _resetDesignCodeCollection,
      _resetSiteClassCollection,
      _resetRiskCategoryCollection,
      _updateDesignCode,
      _updateLocation,
      _updateRiskCategory,
      _updateSiteClass,
      _updateTitle;

  _this = View(params);

  /**
   * Initialize the view.
   */
  _initialize = function () {
    // Three collections for the collection select boxes
    _designCodeCollection = Collection();
    _siteClassCollection = Collection();
    _riskCategoryCollection = Collection();

    // Update the Calculation model when an input new value is selected
    _designCodeCollection.on('select', _updateDesignCode);
    _siteClassCollection.on('select', _updateSiteClass);
    _riskCategoryCollection.on('select', _updateRiskCategory);

    // re-render the view with a calculation model update (for print version)
    _this.model.get('input').on('change', _this.render);
    _this.model.on('change', _this.render); // mode changes

    // scaffold html
    _buildForm();
    _buildCollectionSelectBoxes();

    // Lookup data for collection select boxes
    _factory = LookupDataFactory({});
    _factory.whenReady(function () {
      _buildLocationControl();
      _this.render();
    });
  };

  /**
   * Build the Map and add the LocationControl that is used for
   * inputting location. There are two maps that are created:
   *
   * - _inputMap, has the 4 location controls
   * - _outputMap, has a marker on a map with a zoom-control
   *
   */
  _buildLocationControl = function () {
    var natgeo,
        natgeoOutput,
        input;

    // Input, map with LocationControl and zoom controls
    _inputMap = L.map(_this.el.querySelector('.location-view-input'), {
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
    _inputMap.addLayer(natgeo);
    _inputMap.addControl(_locationControlInput);

    // Output, map with marker and zoom controls
    _outputMap = L.map(_this.el.querySelector('.location-view-output'), {
      center: L.latLng(40.0, -100.0),
      zoom: 3
    });
    natgeoOutput = L.tileLayer('http://server.arcgisonline.com' +
        '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');
    _outputMap.addLayer(natgeoOutput);

    // set initial location
    input = _this.model.get('input');
    if (input.get('latitude') !== null && input.get('longitude') !== null) {
      _locationControlInput.setLocation({
        'latitude': input.get('latitude'),
        'longitude': input.get('longitude')
      });
      _marker = L.marker(L.latLng(input.get('latitude'), input.get('longitude')));
      _marker.addTo(_outputMap);
    }
    // bind to location change
    _locationControlInput.on('location', _updateLocation);
  };


  /**
   * Scaffold out the HTML that is used to render the factory data and
   * input data into the input view.
   */
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

  /**
   * Render the CollectionSelectBox for each of the three collections.
   * All three of these select boxes have a blank option, and they each
   * return model.name for the option element innerHTML. 
   */
  _buildCollectionSelectBoxes = function () {

    _designCodeEl = _this.el.querySelector('#design-code');
    _siteClassEl = _this.el.querySelector('#site-class');
    _riskCategoryEl = _this.el.querySelector('#risk-category');

    // design_code
    CollectionSelectBox({
      collection: _designCodeCollection,
      el: _designCodeEl,
      includeBlankOption: true,
      format: function (model) {
        return model.get('name');
      }
    });

    // site_class
    CollectionSelectBox({
      collection: _siteClassCollection,
      el: _siteClassEl,
      includeBlankOption: true,
      format: function (model) {
        return model.get('name');
      }
    });

    // risk_category
    CollectionSelectBox({
      collection: _riskCategoryCollection,
      el: _riskCategoryEl,
      includeBlankOption: true,
      format: function (model) {
        return model.get('name');
      }
    });
  };

  /**
   * Resets the _designCodeCollection with an array of site class
   * models that match the ids passed in. This is used to dynamically
   * update the data that drives the "design code" CollectionSelectBox.
   * Omitting the ids parameter will return all design codes from
   * the factory.
   *
   * @param  ids {Array}
   *         An array of ids from the collection to be displayed.
   *
   * @return {Array} an array of models from the _designCodeCollection.
   */
  _resetDesignCodeCollection = function (ids) {
    if (typeof ids === 'undefined') {
      _designCodeCollection.reset(_factory.getAllDesignCodes());
    } else {
      _designCodeCollection.reset(_factory.getDesignCodes(ids));
    }
  };

  /**
   * Resets the _siteClassCollection with an array of site class
   * models that match the ids passed in. This is used to dynamically
   * update the data that drives the "site class" CollectionSelectBox.
   * Omitting the ids parameter will return all site classes from
   * the factory.
   *
   * @param  ids {Array}
   *         An array of ids from the collection to be displayed.
   *
   * @return {Array} an array of models from the _siteClassCollection.
   */
  _resetSiteClassCollection = function (ids) {
    if (typeof ids === 'undefined') {
      _siteClassCollection.reset(_factory.getAllSiteClasses());
    } else {
      _siteClassCollection.reset(_factory.getSiteClasses(ids));
    }
  };

  /**
   * Resets the _riskCategoryCollection with an array of site class
   * models that match the ids passed in. This is used to dynamically
   * update the data that drives the "risk category" CollectionSelectBox.
   * Omitting the ids parameter will return all risk categories from
   * the factory.
   *
   * @param  ids {Array}
   *         An array of ids from the collection to be displayed.
   *
   * @return {Array} an array of models from the _riskCategoryCollection.
   */
  _resetRiskCategoryCollection = function (ids) {
    if (typeof ids === 'undefined') {
      _riskCategoryCollection.reset(_factory.getAllRiskCategories());
    } else {
      _riskCategoryCollection.reset(_factory.getRiskCategories(ids));
    }
  };

  /**
   * Use the selected "design code" from the _designCodeCollection to update
   * the input parameters on the Calculation model.
   */
  _updateDesignCode = function () {
    var input = _this.model.get('input');
    input.set({'design_code': _designCodeCollection.getSelected().get('id')});
  };

  /**
   * Use the selected "site class" from the _siteClassCollection to update
   * the input parameters on the Calculation model.
   */
  _updateSiteClass = function () {
    var input = _this.model.get('input');
    input.set({'site_class': _siteClassCollection.getSelected().get('id')});
  };

  /**
   * Use the selected "risk category" from the _riskCategoryCollection
   * to update the input parameters on the Calculation model.
   */
  _updateRiskCategory = function () {
    var input = _this.model.get('input');
    input.set({'risk_category': _riskCategoryCollection.getSelected().get('id')});
  };

  /**
   * Use the input "title" value to update the title on the Calculation Model.
   */
  _updateTitle = function () {
    var input = _this.model.get('input');
    input.set({'title': _titleEl.value});
  };

  /**
   * Updates the Calculation model with the new location (on location change),
   * also updates the location on the "output" map.
   *
   * @param  e {Object}
   *         A location change object, with a location parameter.
   *
   */
  _updateLocation = function (e) {
    var input,
        location = e.location;

    if (location.latitude !== null && location.longitude !== null) {
      // update calculation model
      input = _this.model.get('input');
      input.set({
        'latitude': location.latitude,
        'longitude': location.longitude
      });
      // update location on output map
      if (_marker) {
        _marker.setLatLng(L.latLng(location.latitude, location.longitude));
        _outputMap.panTo(L.latLng(location.latitude, location.longitude));
      } else {
        _marker = L.marker(L.latLng(location.latitude, location.longitude));
        _marker.addTo(_outputMap);
      }
    }
  };

  /**
   * Render the view in "output" mode. All user inputs are hidden
   * and the view is rendered in a print friendly format.
   *
   * @param  model {Object}
   *         Calculation model with inputs to be rendered
   *
   */
  _renderOutputMode = function (model) {
    var title,
        titleEl,
        designCode,
        designCodeEl,
        siteClass,
        siteClassEl,
        riskCategory,
        riskCategoryEl;

    titleEl = _this.el.querySelector('.report-title-output');
    designCodeEl = _this.el.querySelector('.design-code-output');
    siteClassEl = _this.el.querySelector('.site-class-output');
    riskCategoryEl = _this.el.querySelector('.risk-category-output');

    title = model.get('title') || '';

    if (model.get('latitude') !== null && model.get('latitude') !== null) {
      title = title + '<small>(' + model.get('latitude') + ', ' +
        model.get('longitude') + ')</small>';
    }

    // use factory to grab model
    designCode = _factory.getDesignCode(model.get('design_code'));
    siteClass = _factory.getSiteClass(model.get('site_class'));
    riskCategory = _factory.getRiskCategory(model.get('risk_category'));

    // Use name instead of id for display in output mode
    titleEl.innerHTML = (title !== '' ? title : 'No Title');
    designCodeEl.innerHTML = (designCode ? designCode.get('name') : 'No Design Code');
    siteClassEl.innerHTML = (siteClass ? siteClass.get('name') : 'No Site Class');
    riskCategoryEl.innerHTML = (riskCategory ? riskCategory.get('name') : 'No Risk Category');

    // ensure that the tiles load completely
    _outputMap.invalidateSize();
  };

  /**
   * Render the view in "input" mode. Input fields are enabled
   * and the map is rendered with the LocationControl.
   *
   * @param  model {Object}
   *         Calculation model with inputs to be rendered
   *
   */
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

    // ensure that the tiles load completely
    _inputMap.invalidateSize();
  };


  /**
   * Renders the view, based on the current mode of either:
   *  - "input"
   *  - "output"
   *
   */
  _this.render = function () {

    // load design_codes
    if (_designCodeCollection.data().length === 0) {
      _resetDesignCodeCollection();
    }

    if (_this.model.get('mode') === _CALCULATION_MODE_OUTPUT) {
      _renderOutputMode(_this.model.get('input'));
      _this.el.classList.add('input-view-' + _CALCULATION_MODE_OUTPUT);
    } else if (_this.model.get('mode') === _CALCULATION_MODE_INPUT) {
      _renderInputMode(_this.model.get('input'));
      _this.el.classList.remove('input-view-' + _CALCULATION_MODE_OUTPUT);
    }
  };

  /**
   * Cleans up all event bindings, methods, and variables
   */
  _this.destroy = Util.compose(_this.destroy, function () {

    _designCodeCollection.off('select', _updateDesignCode);
    _siteClassCollection.off('select', _updateSiteClass);
    _riskCategoryCollection.off('select', _updateRiskCategory);
    _this.model.get('input').off('change', _this.render);
    _this.model.off('change', _this.render);
    _locationControlInput.off('location', _updateLocation);

    _titleEl.removeEventListener('blur', _updateTitle);

    _designCodeCollection = null;
    _designCodeEl = null;
    _factory = null;
    _inputMap = null;
    _locationControlInput = null;
    _marker = null;
    _riskCategoryCollection = null;
    _riskCategoryEl = null;
    _siteClassCollection = null;
    _siteClassEl = null;
    _titleEl = null;

    _buildCollectionSelectBoxes = null;
    _buildForm = null;
    _buildLocationControl = null;
    _renderInputMode = null;
    _renderOutputMode = null;
    _resetDesignCodeCollection = null;
    _resetSiteClassCollection = null;
    _resetRiskCategoryCollection = null;
    _updateDesignCode = null;
    _updateLocation = null;
    _updateRiskCategory = null;
    _updateSiteClass = null;
    _updateTitle = null;

    _initialize = null;
    _this = null;
  });

  _initialize();
  params = null;
  return _this;

};

module.exports = NEHRP2015InputView;
