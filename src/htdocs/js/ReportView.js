'use strict';

var Calculation = require('Calculation'),
    Nehrp2015Renderer = require('renderer/nehrp2015/Nehrp2015Renderer'),

    Collection = require('mvc/Collection'),
    View = require('mvc/View');

var ReportView = function (params) {
  var _this,
      _initialize,

      _collection,
      _destroyCollection,
      _renderer,

      _getRenderer,
      _initializeRenderers,
      _onCollectionDeselect,
      _onCollectionSelect;


  _this = View(params);

  _initialize = function (params) {
    params = params || {};

    _collection = params.collection;

    if (!_collection) {
      _collection = Collection([_this.model]);
      _destroyCollection = true;
    }

    if (!_collection.get(_this.model.get('id'))) {
      _collection.add(_this.model);
    }

    if (_collection.getSelected()) {
      // Switch to the selected model
      _this.model.off('change', 'render', _this);
      _onCollectionSelect();
    } else {
      // None previously selected, select this model
      _collection.select(_this.model);
    }

    _initializeRenderers();

    _this.render();
  };


  _getRenderer = function () {
    // TODO :: Check model edition and choose correct renderer
    return _renderer;
  };

  _initializeRenderers = function () {
    // TODO :: Create renderer for each known design code, potentially defer
    //         instantiation until needed
    _renderer = Nehrp2015Renderer();
  };

  _onCollectionDeselect = function () {
    _this.model.off('change', 'render', _this);
    _this.model = null;
    _this.render();
  };

  _onCollectionSelect = function () {
    _this.model = _collection.getSelected();
    _this.model.on('change', 'render', _this);
    _this.render();
  };


  _this.destroy = function () {

  };

  _this.render = function () {
    var renderer;
    _this.el.innerHTML = '';

    if (_this.model && _this.model.get('mode') === Calculation.MODE_OUTPUT) {
      _this.model.off('change', 'render', _this);
      renderer = _getRenderer();
      _this.el.appendChild(renderer.getReport(_this.model));

      renderer.contentInDom();
      _this.model.on('change', 'render', _this);
    }
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ReportView;
