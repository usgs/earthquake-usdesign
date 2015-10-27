'use strict';

var Calculation = require('Calculation'),
    CalculationView = require('CalculationView'),

    BatchConverter = require('util/BatchConverter'),

    Accordion = require('accordion/Accordion'),

    Collection = require('mvc/Collection'),
    CollectionView = require('mvc/CollectionView'),
    FileInputView = require('mvc/FileInputView'),
    ModalView = require('mvc/ModalView'),
    View = require('mvc/View'),

    Util = require('util/Util');


var ActionsView = function (params) {
  var _this,
      _initialize,

      _accordion,
      _batchLoader,
      _btnBatch,
      _btnCalculate,
      _btnDownload,
      _btnEdit,
      _btnNew,
      _btnPrint,
      _collection,
      _collectionView,
      _converter,
      _destroyCollection,

      _bindEventHandlers,
      _createViewSkeleton,
      _onBatchClick,
      _onBatchUpload,
      _onCalculateClick,
      _onCollectionDeselect,
      _onCollectionSelect,
      _onDownloadClick,
      _onEditClick,
      _onModelChange,
      _onNewClick,
      _onPrintClick,
      _setRenderMode,
      _unbindEventHandlers;


  _this = View(Util.extend({model: Calculation()}, params));

  _initialize = function (params) {
    params = params || {};

    _collection = params.collection;
    _batchLoader = FileInputView({
      uploadCallback: _onBatchUpload
    });

    _converter = BatchConverter();

    if (!_collection) {
      _collection = Collection([]);
      _destroyCollection = true;
    }

    _this.model.off('change', 'render', _this);

    _createViewSkeleton();
    _bindEventHandlers();
  };


  _bindEventHandlers = function () {
    _btnCalculate.addEventListener('click', _onCalculateClick);
    _btnEdit.addEventListener('click', _onEditClick);
    _btnNew.addEventListener('click', _onNewClick);
    _btnBatch.addEventListener('click', _onBatchClick);
    _btnDownload.addEventListener('click', _onDownloadClick);
    _btnPrint.addEventListener('click', _onPrintClick);

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
      '<button class="actions-view-calculate blue" ',
          'title="Click to run calculation for currently selected options."',
          '>Calculate</button>',
      '<button class="actions-view-edit blue" ',
          'title="Click to edit the currently selected calculation inputs."',
          '>Edit</button>',
      '<button class="actions-view-new" ',
          'title="Click to create a new calculation."',
          '>New</button>',
      '<button class="actions-view-print">Print</button>',
      '<a href="#" class="actions-view-download" ',
          'title="Click to donwload results as CSV"',
          '>Download</a>',
      '<button class="actions-view-upload" ',
          'title="Click to upload a CSV batch file."',
          '>Upload</button>'
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
    _btnBatch = _this.el.querySelector('.actions-view-upload');
    _btnDownload = _this.el.querySelector('.actions-view-download');
    _btnPrint = _this.el.querySelector('.actions-view-print');

    // Update _btnPrint title attribute to be OS specfic (cmd-p vs ctrl-p)
    if (navigator.userAgent.toUpperCase().indexOf('MAC') !== -1) {
      _btnPrint.setAttribute('title', 'Cmd-p');
    } else {
      _btnPrint.setAttribute('title', 'Ctrl-p');
    }
  };

  _onBatchClick = function () {
    _batchLoader.show();
  };

  _onBatchUpload = function (files) {
    // Clean up the grabage
    _collection.data().slice(0).forEach(function (calculation) {
      var status = calculation.get('status');

      if (status === Calculation.STATUS_NEW ||
          status === Calculation.STATUS_INVALID) {
        _collection.remove(calculation);
      }
    });

    files.forEach(function (file) {
      var calculations,
          content;

      content = file.get('content');
      calculations = _converter.toCalculation(content);

      if (calculations.length) {
        _collection.add.apply(_collection, calculations);
        _collection.select(calculations[calculations.length -1]);
      }
    });

    _onCalculateClick();
  };

  _onCalculateClick = function () {
    // notify application user requested calculation
    _this.trigger('calculate');
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

  _onDownloadClick = function (evt) {
    var results;

    results = _collection.data().filter(function (calculation) {
      return calculation.get('status') === Calculation.STATUS_COMPLETE;
    });

    if (results.length === 0) {
      // Some calculations, but none ready for download; show error and quit
      ModalView('<p>No calculations ready for download.</p>', {
        title: 'Download Error',
        classes: ['modal-warning']
      }).show();

      evt.preventDefault();
      return false;
    }

    _btnDownload.setAttribute('href', 'data:text/csv,' +
        window.escape(_converter.toCSV(results)));
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

  /**
   * Shows the browser's print dialog, triggered on "print" button click.
   */
  _onPrintClick = function () {
    window.print();
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
    _btnBatch.removeEventListener('click', _onBatchClick);
    _btnDownload.removeEventListener('click', _onDownloadClick);
    _btnPrint.removeEventListener('click', _onPrintClick);

    _collection.off('select', _onCollectionSelect);
    _collection.off('deselect', _onCollectionDeselect);
  };


  _this.destroy = Util.compose(function () {
    _unbindEventHandlers();

    _accordion.destroy();
    _batchLoader.destroy();

    if (_destroyCollection) {
      _collection.destroy();
    }

    _accordion = null;
    _batchLoader = null;
    _btnBatch = null;
    _btnCalculate = null;
    _btnEdit = null;
    _btnNew = null;
    _btnPrint = null;
    _collection = null;
    _destroyCollection = null;

    _bindEventHandlers = null;
    _createViewSkeleton = null;
    _onBatchUpload = null;
    _onBatchClick = null;
    _onCalculateClick = null;
    _onCollectionDeselect = null;
    _onCollectionSelect = null;
    _onEditClick = null;
    _onNewClick = null;
    _onPrintClick = null;
    _onModelChange = null;
    _setRenderMode = null;
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
