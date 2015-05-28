'use strict';

var LookupDataFactory = require('util/LookupDataFactory'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    View = require('mvc/View');

var _CALCULATION_MODE_INPUT = 'input',
    _CALCULATION_MODE_OUTPUT = 'output';

var NEHRP2015InputView = function (params) {
  var _this,
      _initialize,

      _factory,
      _designCodeCollection,
      _designCodeEl,
      _riskCategoryCollection,
      _riskCategoryEl,
      _siteClassCollection,
      _siteClassEl,
      _titleEl,

      _buildForm,
      _buildCollectionSelectBoxes,
      _renderInputMode,
      _renderOutputMode,
      _resetDesignCodeCollection,
      _resetSiteClassCollection,
      _resetRiskCategoryCollection,
      _updateDesignCode,
      _updateSiteClass,
      _updateRiskCategory,
      _updateTitle;

  _this = View(params);

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

    // Lookup data for collection select boxes
    _factory = LookupDataFactory({});
    _factory.whenReady(function () {
      // structure html
      _buildForm();
      _buildCollectionSelectBoxes();
      _this.render();
    });
  };

  _buildForm = function () {
    _this.el.className = 'vertical';
    _this.el.innerHTML =
        '<label for="title">Title</label>' +
        '<input type="text" name="title" id="title" ' +
          'placeholder="Untitled Report" />' +
        '<h1 class="title-output"></h1>' +
        '<div class="row">' +
          '<div class="column three-of-five">' +
            '<label for="location-view">Location</label>' +
            '<div class="location-view"></div>' +
          '</div>' +
          '<div class="column two-of-five">' +
            '<label for="design-code">Design Code</label>' +
            '<select name="design-code" id="design-code"></select>' +
            '<div class="design-code-output"></div>' +
            '<label for="site-class">Site Class</label>' +
            '<select name="site-class" id="site-class"></select>' +
            '<div class="site-class-output"></div>' +
            '<label for="risk-category">Risk Category</label>' +
            '<select name="risk-category" id="risk-category"></select>' +
            '<div class="risk-category-output"></div>' +
          '</div>' +
        '</div>';

    _titleEl = _this.el.querySelector('#title');
    // Update title on change
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
    var input = _this.model.get('input');
    input.set({'design_code': _designCodeCollection.getSelected().get('id')});
  };

  // update site_class in the model
  _updateSiteClass = function () {
    var input = _this.model.get('input');
    input.set({'site_class': _siteClassCollection.getSelected().get('id')});
  };

  // update risk_category in the model
  _updateRiskCategory = function () {
    var input = _this.model.get('input');
    input.set({'risk_category': _riskCategoryCollection.getSelected().get('id')});
  };

  _updateTitle = function () {
    var input = _this.model.get('input');
    input.set({'title': _titleEl.value});
  };

  // updates output view
  _renderOutputMode = function (model) {
    var title,
        titleEl,
        designCode,
        designCodeEl,
        siteClass,
        siteClassEl,
        riskCategory,
        riskCategoryEl;

    titleEl = _this.el.querySelector('.title-output');
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
    titleEl.innerHTML = title;
    designCodeEl.innerHTML = designCode.get('name');
    siteClassEl.innerHTML = siteClass.get('name');
    riskCategoryEl.innerHTML = riskCategory.get('name');
  };

  // updates input view
  _renderInputMode = function (model) {
    var design_code = null;

    if (model.get('title') !== null) {
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
  };


  // Updates the view based on the model
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

  _initialize();
  params = null;
  return _this;

};

module.exports = NEHRP2015InputView;