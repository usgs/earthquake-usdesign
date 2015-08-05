'use strict';

var Calculation = require('Calculation'),

    Formatter = require('util/Formatter'),
    LookupDataFactory = require('util/LookupDataFactory'),


    Collection = require('mvc/Collection'),
    View = require('mvc/View'),

    Util = require('util/Util');

/**
 * This class is a view for a single Calculation model. It is suitable for
 * use with the CollectionView abstraction. This view shows input values for
 * a calculation.
 *
 * @param params {Object} See: #_initialize
 */
var CalculationView = function (params) {
  var _this,
      _initialize,

      _collection,
      _destroyCollection,
      _destroyLookupFactory,
      _destroyModel,
      _input,
      _lookupFactory,
      _model,
      _statusClass,

      _bindEventListeners,
      _onDeleteClick,
      _onModelClick,
      _onViewClick,
      _render,
      _unbindEventListeners;


  _this = View(params);

  /**
   *
   * @param params {Object}
   *      An object containing configuration parameters for this view. This
   *      object may have the following keys:
   *
   *      params.collection {Collection}
   *          Collection containing the model.
   *      params.lookupFactory {LookupDataFactory}
   *          Factory to map model ids to strings.
   *      params.model {Calculation}
   *          Model to render.
   *      params.el {DOMElement}
   *          Container to render into.
   *
   */
  _initialize = function (params) {
    params = params || {};

    _model = params.model;
    _collection = params.collection;
    _lookupFactory = params.lookupFactory;
    _statusClass = null;

    if (!_model) {
      _model = Calculation();
      _destroyModel = true;
    }
    _input = _model.get('input');

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

  /**
   * Creates DOM and Model event listeners.
   *
   */
  _bindEventListeners = function () {
    _this.el.addEventListener('click', _onViewClick);
    _input.on('change', _this.render);
  };

  /**
   * Called when delete button is clicked. If the _model is in the _collection,
   * removes it.
   *
   */
  _onDeleteClick = function () {
    if (_collection.get(_model.get('id')) !== null) {
      _collection.remove(_model);
    }
  };

  /**
   * Called when the model view is clicked. If the _model is in the _collection,
   * selects it.
   *
   */
  _onModelClick = function () {
    if (_collection.get(_model.get('id')) !== null) {
      _collection.select(_model);
    }
  };

  /**
   * Event delegator. Called when any part of the view is clicked. Determines
   * which part of the view was clicked and executes the corresponding
   * event handler.
   *
   * @param evt {Event}
   *      The event that triggered this method call.
   */
  _onViewClick = function (evt) {
    var target = evt.target;

    if (target.classList.contains('calculation-delete')) {
      _onDeleteClick();
    } else {
      _onModelClick();
    }
  };

  /**
   * Performs actual rendering. Updates view to reflect current state of the
   * _model attributes.
   *
   */
  _render = function () {
    var designCode,
        input,
        markup,
        riskCategory,
        siteClass,
        status,
        subtitle,
        title;

    input = _model.get('input');

    title = input.get('title');
    subtitle = Formatter.latitude(input.get('latitude')) + ', ' +
        Formatter.longitude(input.get('longitude'));

    designCode = _lookupFactory.getDesignCode(input.get('design_code'));
    siteClass = _lookupFactory.getSiteClass(input.get('site_class'));
    riskCategory = _lookupFactory.getRiskCategory(input.get('risk_category'));

    if (designCode && designCode.get) {
      designCode = Formatter.value(designCode.get('name'));
    } else {
      designCode = '&ndash;';
    }

    if (siteClass && siteClass.get) {
      siteClass = Formatter.value(siteClass.get('value')) + ' - ' +
          Formatter.value(siteClass.get('name'));
    } else {
      siteClass = '&ndash;';
    }

    if (riskCategory && riskCategory.get) {
      riskCategory = Formatter.value(riskCategory.get('name'));
    } else {
      riskCategory = '&ndash;';
    }

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

    status = _model.get('status');
    // set status class on view
    if (_statusClass !== null) {
      _this.el.classList.remove(_statusClass);
    }
    _statusClass = 'status-' + status;
    _this.el.classList.add(_statusClass);
    // display status
    markup.push(
        '<span class="calculation-status ' + _statusClass + '">' +
          status +
        '</span>');

    if (_collection.get(_model.get('id')) !== null) {
      markup.push('<button class="calculation-delete">Delete</button>');
    }

    _this.el.innerHTML = markup.join('');
  };

  /**
   * Removes event listeners.
   *
   */
  _unbindEventListeners = function () {
    _this.el.removeEventListener('click', _onViewClick);
    _input.off('change', _this.render);
  };


  /**
   * Extends default view implementation. Cleans up allocations made for
   * this instance.
   *
   */
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
    _input = null;

    _bindEventListeners = null;
    _onDeleteClick = null;
    _onModelClick = null;
    _onViewClick = null;
    _render = null;
    _unbindEventListeners = null;

    _initialize = null;
    _this = null;
  });

  /**
   * Render the _model. This waits for the _lookupFactory to be ready before
   * rendering is performed.
   *
   * @see #_render
   */
  _this.render = function () {
    _lookupFactory.whenReady(_render);
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = CalculationView;
