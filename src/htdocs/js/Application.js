'use strict';

var ActionsView = require('ActionsView'),
    Calculation = require('Calculation'),
    NEHRP2015InputView = require('NEHRP2015InputView'),
    ReportView = require('ReportView'),
    WebServiceAccessor = require('WebServiceAccessor'),

    LookupDataFactory = require('util/LookupDataFactory'),

    Collection = require('mvc/Collection');

var Application = function (params) {
  var _this,
      _initialize,

      _actionsView,
      _collection,
      _concurrentRequests,
      _destroyLookupFactory,
      _inputView,
      _lookupFactory,
      _model,
      _reportView,
      _service,

      _initializeAttributes,
      _initializeView,
      _onCalculate;


  _this = {
    destroy: null
  };

  _initialize = function (params) {
    params = params || {};

    _initializeAttributes(params);
    _initializeView();
  };


  _initializeAttributes = function (params) {
    _this.el = params.el || document.createElement('div');

    _model = params.model;
    _collection = params.collection;
    _concurrentRequests = params.concurrentRequests || 3;
    _lookupFactory = params.lookupFactory;
    _service = params.service || WebServiceAccessor();

    // Make sure we have a model
    if (!_model) {
      if (_collection && _collection.getSelected()) {
        // Try to get model off the collection
        _model = _collection.getSelected();
      } else {
        _model = Calculation({
          input: {
            latitude: null,
            longitude: null,
            design_code: null,
            site_class: null,
            risk_category: null,
            title: null,
          }
        });
      }
    }

    // Make sure we have a collection
    if (!_collection) {
      _collection = Collection([_model]);
    }

    // Make sure model is in collection
    if (!_collection.get(_model.get('id'))) {
      _collection.add(_model);
    }

    // Select model if no other model previously selected
    if (!_collection.getSelected()) {
      _collection.select(_model);
    }

    if (_lookupFactory) {
      _lookupFactory = LookupDataFactory();
      _destroyLookupFactory = true;
    }
  };

  _initializeView = function () {
    // Build view skeleton
    _this.el.innerHTML = [
      '<div class="input-view">Input View</div>',
      '<div class="actions-view">Actions View</div>',
      '<div class="report-view">Report View</div>'
    ].join('');

    // Create sub-views
    _inputView = NEHRP2015InputView({
      collection: _collection,
      el: _this.el.querySelector('.input-view'),
      model: _model
    });

    _actionsView = ActionsView({
      collection: _collection,
      el: _this.el.querySelector('.actions-view'),
      model: _model
    });
    _actionsView.on('calculate', _onCalculate);

    _reportView = ReportView({
      collection: _collection,
      el: _this.el.querySelector('.report-view'),
      model: _model
    });
  };

  /**
   * "Calculate" event handler.
   *
   * Requests calculation for any models that have STATUS_READY.
   */
  _onCalculate = function () {
    var next,
        ready,
        sent;

    ready = [];
    sent = [];
    _collection.data().forEach(function (calc) {
      var status = calc.get('status');
      if (status === Calculation.STATUS_READY) {
        ready.push(calc);
      } else if (status === Calculation.STATUS_SENT) {
        sent.push(calc);
      }
    });

    while (
        // there are calculations ready to send
        ready.length > 0 &&
        // there aren't too many active requests
        sent.length < _concurrentRequests) {
      next = ready.shift();
      _service.getResults(next, _onCalculate, _onCalculate);
      next.set({
        'status': Calculation.STATUS_SENT
      });
      sent.push(next);
    }
  };

  _this.destroy = function () {
    _inputView.destroy();
    _actionsView.destroy();
    _reportView.destroy();

    if (_destroyLookupFactory) {
      _lookupFactory.destroy();
    }


    _actionsView = null;
    _destroyLookupFactory = null;
    _inputView = null;
    _lookupFactory = null;
    _reportView = null;


    _initialize = null;
    _this = null;
  };

  _initialize(params);
  params = null;
  return _this;
};

module.exports = Application;
