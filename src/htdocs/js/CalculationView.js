'use strict';

var Calculation = require('Calculation'),

    Formatter = require('util/Formatter'),
    LookupDataFactory = require('util/LookupDataFactory'),


    Collection = require('mvc/Collection'),
    View = require('mvc/View'),

    Util = require('util/Util');


var CalculationView = function (params) {
  var _this,
      _initialize,

      _collection,
      _destroyCollection,
      _destroyLookupFactory,
      _destroyModel,
      _lookupFactory,
      _model,

      _bindEventListeners,
      _onDeleteClick,
      _onModelClick,
      _onViewClick,
      _render,
      _unbindEventListeners;


  _this = View(params);

  _initialize = function (params) {
    _model = params.model;
    _collection = params.collection;
    _lookupFactory = params.lookupFactory;

    if (!_model) {
      _model = Calculation();
      _destroyModel = true;
    }

    if (!_collection) {
      _collection = Collection([_model]);
      _destroyCollection = true;
    }

    if (!_lookupFactory) {
      _lookupFactory = LookupDataFactory();
      _destroyLookupFactory = true;
    }

    _this.el.classList.add('calculation-view');

    _bindEventListeners();

    _this.render();
  };


  _bindEventListeners = function () {
    _this.el.addEventListener('click', _onViewClick);
  };

  _onDeleteClick = function () {
    if (_collection.get(_model.get('id')) !== null) {
      _collection.remove(_model);
    }
  };

  _onModelClick = function () {
    if (_collection.get(_model.get('id')) !== null) {
      _collection.select(_model);
    }
  };

  _onViewClick = function (evt) {
    var target = evt.target;

    if (target.classList.contains('calculation-delete')) {
      _onDeleteClick();
    } else {
      _onModelClick();
    }
  };

  _render = function () {
    var designCode,
        input,
        markup,
        riskCategory,
        siteClass,
        subtitle,
        title;

    input = _model.get('input');

    title = input.get('title');
    subtitle = Formatter.latitude(input.get('latitude')) + ', ' +
        Formatter.longitude(input.get('longitude'));

    designCode = _lookupFactory.getDesignCode(input.get('design_code'));
    siteClass = _lookupFactory.getSiteClass(input.get('site_class'));
    riskCategory = _lookupFactory.getRiskCategory(input.get('risk_category'));

    designCode = Formatter.value(designCode.get('name'));
    siteClass = Formatter.value(siteClass.get('value')) + ' - ' +
        Formatter.value(siteClass.get('name'));
    riskCategory = Formatter.value(riskCategory.get('name'));

    markup = [
      '<h3 class="calculation-title">',
        title,
        '<small class="calculation-subtitle">', subtitle, '</small>',
      '</h3>',
      '<dl class="calculation-inputs">',
        '<dt class="calculation-design-code">Design Code</dt>',
        '<dd class="calculation-design-code">', designCode, '</dd>',

        '<dt class="calculation-site-class">Site Class</dt>',
        '<dd class="calculation-site-class">', siteClass, '</dd>',

        '<dt class="calculation-risk-cateogry">Risk Category</dt>',
        '<dd class="calculation-risk-category">', riskCategory, '</dd>',
      '</dl>'
    ];

    if (_collection.get(_model.get('id')) !== null) {
      markup.push('<button class="calculation-delete">Delete</button>');
    }

    _this.el.innerHTML = markup.join('');
  };

  _unbindEventListeners = function () {
    _this.el.removeEventListener('click', _onViewClick);
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _unbindEventListeners();

    if (_destroyCollection) {
      _collection.destroy();
    }

    if (_destroyModel) {
      _model.destroy();
    }

    if (_destroyLookupFactory) {
      _lookupFactory.destroy();
    }

    _collection = null;
    _destroyCollection = null;
    _destroyLookupFactory = null;
    _destroyModel = null;
    _lookupFactory = null;
    _model = null;

    _bindEventListeners = null;
    _onDeleteClick = null;
    _onModelClick = null;
    _onViewClick = null;
    _render = null;
    _unbindEventListeners = null;

    _initialize = null;
    _this = null;
  });

  _this.render = function () {
    _lookupFactory.whenReady(_render);
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = CalculationView;
