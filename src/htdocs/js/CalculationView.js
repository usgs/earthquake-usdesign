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
      _model,

      _bindEventListeners,
      _destroyCollection,
      _destroyModel,
      _metadata,
      _onDeleteClick,
      _onModelClick,
      _onViewClick,
      _unbindEventListeners;


  _this = View(params);

  _initialize = function (params) {
    _model = params.model;
    _collection = params.collection;
    _metadata = params.metadata;

    if (!_model) {
      _model = Calculation();
      _destroyModel = true;
    }

    if (!_collection) {
      _collection = Collection([_model]);
      _destroyCollection = true;
    }

    if (!_metadata) {
      _metadata = LookupDataFactory();
    }

    _bindEventListeners();

    _this.render();
  };


  _bindEventListeners = function () {
    _this.el.addEventListener('click', _onViewClick);
  };

  _onDeleteClick = function () {
    _collection.remove(_model);
  };

  _onModelClick = function () {
    _collection.select(_model);
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
    _this.el.innerHTML = [
      '<h3 class="calculation-title">',
        Formatter.calculationTitle(_model),
      '</h3>',
      '<dl>',
        '<dt class="calculation-design-code">Design Code</dt>',
        '<dd class="calculation-design-code">',
          _metadata.getDesignCode(_mode.get('input').design_code).get('name'),
        '</dd>'

      '</dl>',
      '<button class="calculation-delete">Delete</button>'
    ].join('');
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

    _collection = null;
    _model = null;

    _bindEventListeners = null;
    _destroyCollection = null;
    _destroyModel = null;
    _onDeleteClick = null;
    _onModelClick = null;
    _onViewClick = null;
    _unbindEventListeners = null;

    _initialize = null;
    _this = null;
  });

  _this.render = function () {
    _metadata.whenReady(_render);
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = CalculationView;
