'use strict';

var LookupDataFactory = require('util/LookupDataFactory'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    View = require('mvc/View');

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
      _resetDesignCodeCollection,
      _resetSiteClassCollection,
      _resetRiskCategoryCollection,
      _updateDesignCode,
      _updateSiteClass,
      _updateRiskCategory;

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
    _designCodeCollection.on('select', _this.render);

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
        '<div class="row">' +
          '<div class="column three-of-five">' +
            '<label for="location-view">Location</label>' +
            '<div class="location-view"></div>' +
          '</div>' +
          '<div class="column two-of-five">' +
            '<label for="design-code">Design Code</label>' +
            '<select name="design-code" id="design-code"></select>' +
            '<label for="site-class">Site Class</label>' +
            '<select name="site-class" id="site-class"></select>' +
            '<label for="risk-category">Risk Category</label>' +
            '<select name="risk-category" id="risk-category"></select>' +
          '</div>' +
        '</div>';
  };

  _buildCollectionSelectBoxes = function () {

    // Save references to collection select boxes
    _titleEl = _this.el.querySelector('#title');
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
    // TODO, make this silent
    input.design_code = _designCodeEl.selectedOptions[0].innerHTML;
  };

  // update site_class in the model
  _updateSiteClass = function () {
    var input = _this.model.get('input');
    // TODO, make this silent
    input.site_class = _siteClassEl.selectedOptions[0].innerHTML;
  };

  // update risk_category in the model
  _updateRiskCategory = function () {
    var input = _this.model.get('input');
    // TODO, make this silent
    input.risk_category = _riskCategoryEl.selectedOptions[0].innerHTML;
  };

  // Updates the view based on the model
  _this.render = function () {
    var design_code = null,
        design_code_id = null,
        input = null;

    input = _this.model.get('input');

    // update title text
    if (input.title !== null) {
      _titleEl.value = input.title;
    }

    // get design code values from the DOM
    design_code_id = 1; //_designCodeEl.value;
    design_code = _factory.getDesignCode(design_code_id);

    // if design_code is set it determines the values in the remaining CollectionSelectBoxes
    if (input.design_code === null) {
      // reset CollectionSelectBox
      _resetDesignCodeCollection();
      // disable site_class & risk_category
      _siteClassEl.setAttribute('disabled', true);
      _riskCategoryEl.setAttribute('disabled', true);
    // the value recently changed
    } else {
      // update site_class and risk_category
      _resetSiteClassCollection(design_code.get('site_classes'));
      _resetRiskCategoryCollection(design_code.get('risk_categories'));
      // enable the now populated CollectionSelectBoxes
      _siteClassEl.removeAttribute('disabled');
      _riskCategoryEl.removeAttribute('disabled');
    }
  };

  _initialize();
  params = null;
  return _this;

};

module.exports = NEHRP2015InputView;