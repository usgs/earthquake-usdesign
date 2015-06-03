'use strict';

var Calculation = require('Calculation'),
    CalculationView = require('CalculationView'),
    WebServiceAccessor = require('WebServiceAccessor'),

    Accordion = require('accordion/Accordion'),

    Collection = require('mvc/Collection'),
    CollectionView = require('mvc/CollectionView'),
    View = require('mvc/View'),

    Util = require('util/Util');


var ActionsView = function (params) {
  var _this,
      _initialize,

      _accessor,
      _accordion,
      _btnCalculate,
      _btnEdit,
      _btnNew,
      _collection,
      _collectionView,
      _destroyCollection,

      _bindEventHandlers,
      _createViewSkeleton,
      _onCalculateClick,
      _onCollectionDeselect,
      _onCollectionSelect,
      _onEditClick,
      _onModelChange,
      _onNewClick,
      _onRemove,
      _setRenderMode,
      _unbindEventHandlers;


  _this = View(Util.extend({model: Calculation()}, params));

  _initialize = function (params) {
    params = params || {};

    _accessor = params.accessor;
    _collection = params.collection;

    if (!_accessor) {
      _accessor = WebServiceAccessor();
    }

    if (!_collection) {
      _collection = Collection([]);
      _destroyCollection = true;
    }

    _this.model.off('change', 'render', _this);
    _collection.on('remove', _onRemove);

    _createViewSkeleton();
    _bindEventHandlers();
  };

  /**
   * Anytime a Calculation model is removed from the collection a new
   * blank model should be added to the collection and selected.
   */
  _onRemove = function () {
    _onNewClick();
  };

  _bindEventHandlers = function () {
    _btnCalculate.addEventListener('click', _onCalculateClick);
    _btnEdit.addEventListener('click', _onEditClick);
    _btnNew.addEventListener('click', _onNewClick);

    _collection.on('select', _onCollectionSelect);
    _collection.on('deselect', _onCollectionDeselect);

    _onCollectionSelect();
  };

  _createViewSkeleton = function () {
    var headerMarkup;

    _this.el.innerHTML = '';
    _this.el.classList.add('actions-view');
    _this.el.classList.add('actions-view-mode-input');

    headerMarkup = [
      '<button class="actions-view-calculate" ',
          'title="Click to run calculation for currently selected options."',
          '>Calculate</button>',
      '<button class="actions-view-edit" ',
          'title="Click to edit the currently selected calculation inputs."',
          '>Edit</button>',
      '<button class="actions-view-new" ',
          'title="Click to create a new calculation."',
          '>New</button>'
    ].join('');

    _collectionView = CollectionView({
      collection: _collection,
      el: document.createElement('ul'),
      factory: CalculationView
    });
    _collectionView.el.classList.add('actions-view-history');

    _accordion = Accordion({
      el: _this.el,
      accordions: [
        {
          toggleElement: 'div',
          toggleText: headerMarkup,
          content: _collectionView.el,
          classes: 'accordion-closed'
        }
      ]
    });
    _this.el.querySelector('.accordion-toggle').classList.add(
        'actions-view-actions');


    _btnCalculate = _this.el.querySelector('.actions-view-calculate');
    _btnEdit = _this.el.querySelector('.actions-view-edit');
    _btnNew = _this.el.querySelector('.actions-view-new');
  };

  _onCalculateClick = function () {
    if (_this.model) {
      //_this.model.set({'mode': Calculation.MODE_OUTPUT});

      _accessor.getResults(_this.model);
    }

  };

  _onCollectionDeselect = function () {
    if (_this.model) {
      _this.model.off('change:mode', _onModelChange);
    }
    _this.model = null;
  };

  _onCollectionSelect = function () {
    _this.model = _collection.getSelected();
    if (_this.model) {
      _this.model.on('change:mode', _onModelChange);
      _onModelChange();
    }
  };

  _onEditClick = function () {
    if (_this.model) {
      _this.model.set({'mode': Calculation.MODE_INPUT});
    }
  };

  _onModelChange = function () {
    _setRenderMode(_this.model.get('mode'));
  };

  _onNewClick = function () {
    var calculation;

    calculation = Calculation();

    _collection.add(calculation);
    _collection.select(calculation);
  };

  _setRenderMode = function (mode) {
    var classList;

    classList = _this.el.classList;

    if (mode === Calculation.MODE_OUTPUT) {
      classList.add('actions-view-mode-output');
      classList.remove('actions-view-mode-input');
    } else if (mode === Calculation.MODE_INPUT) {
      classList.add('actions-view-mode-input');
      classList.remove('actions-view-mode-output');
    }
  };

  _unbindEventHandlers = function () {
    _btnCalculate.removeEventListener('click', _onCalculateClick);
    _btnEdit.removeEventListener('click', _onEditClick);
    _btnNew.removeEventListener('click', _onNewClick);

    _collection.off('select', _onCollectionSelect);
    _collection.off('deselect', _onCollectionDeselect);
  };


  _this.destroy = Util.compose(function () {
    _unbindEventHandlers();
    _accordion.destroy();

    if (_destroyCollection) {
      _collection.destroy();
    }

    _btnCalculate = null;
    _btnEdit = null;
    _btnNew = null;
    _collection = null;
    _destroyCollection = null;

    _bindEventHandlers = null;
    _createViewSkeleton = null;
    _onCalculateClick = null;
    _onCollectionDeselect = null;
    _onCollectionSelect = null;
    _onEditClick = null;
    _onNewClick = null;
    _onModelChange = null;
    _setRenderMode = null;
    _onRemove = null;
    _unbindEventHandlers = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {

  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ActionsView;
