'use strict';

var LookupDataFactory = require('util/LookupDataFactory'),

    Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    View = require('mvc/View');

var NEHRP2015InputView = function (params) {
  var _this,
      _initialize,

      _factory,
      _designCodes,
      _designCodeEl,
      _riskCategories,
      _riskCategoriesEl,
      _siteClasses,
      _siteClassesEl,
      _titleEl,

      _buildForm,
      _getDesignCodes,
      _getSiteClasses,
      _getRiskCategories,
      _updateDesignCode,
      _updateSiteClass,
      _updateRiskCategory;

  _this = View(params);

  _initialize = function () {

    // Three collections for the collection select boxes
    _designCodes = Collection();
    _siteClasses = Collection();
    _riskCategories = Collection();

    // Update the Calculation model when an input new value is selected
    _designCodes.on('select', _updateDesignCode);
    _siteClasses.on('select', _updateSiteClass);
    _riskCategories.on('select', _updateRiskCategory);

    _buildForm();

    // Lookup data for collection select boxes
    _factory = LookupDataFactory({});
    _factory.whenReady(function () {
      _this.render();

      // // TODO, re-render the view with a calculation model update (for print version)
      // _designCodes.on('select', _this.render);
      // _siteClasses.on('select', _this.render);
      // _riskCategories.on('select', _this.render);
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

    // Save references to collection select boxes
    _titleEl = _this.el.querySelector('#title');
    _designCodeEl = _this.el.querySelector('#design-code');
    _siteClassesEl = _this.el.querySelector('#site-class');
    _riskCategoriesEl = _this.el.querySelector('#risk-category');

    // design_code CollectionSelectBox
    CollectionSelectBox({
      collection: _designCodes,
      el: _designCodeEl,
      includeBlankOption: true,
      format: function (model) {
        return model.get('name');
      }
    });

    // site_class CollectionSelectBox
    CollectionSelectBox({
      collection: _siteClasses,
      el: _siteClassesEl,
      includeBlankOption: true,
      format: function (model) {
        return model.get('name');
      }
    });

    // risk_category CollectionSelectBox
    CollectionSelectBox({
      collection: _riskCategories,
      el: _riskCategoriesEl,
      includeBlankOption: true,
      format: function (model) {
        return model.get('name');
      }
    });
  };

  _getDesignCodes = function (ids) {
    if (typeof ids === 'undefined') {
      _designCodes.reset(_factory.getAllDesignCodes());
    } else {
      _designCodes.reset(_factory.getDesignCodes(ids));
    }
  };

  _getSiteClasses = function (ids) {
    if (typeof ids === 'undefined') {
      _siteClasses.reset(_factory.getAllSiteClasses());
    } else {
      _siteClasses.reset(_factory.getSiteClasses(ids));
    }
  };

  _getRiskCategories = function (ids) {
    if (typeof ids === 'undefined') {
      _riskCategories.reset(_factory.getAllRiskCategories());
    } else {
      _riskCategories.reset(_factory.getRiskCategories(ids));
    }
  };

  _updateDesignCode = function () {
    var design_code,
        design_code_id;

    // dummied up, the CollectionSelectBox doesn't allow you to set the value
    design_code_id = 1;

    // update design_code in the model
    _this.model.get('input').design_code = design_code_id;
    _this.model.get('input').site_class = null;
    _this.model.get('input').risk_category = null;

    // update site_class and risk_category
    design_code = _factory.getDesignCode(design_code_id);
    _getSiteClasses(design_code.get('site_classes'));
    _getRiskCategories(design_code.get('risk_categories'));
  };

  _updateSiteClass = function () {
    // update site_class in the model
    _this.model.get('input').site_class = _siteClassesEl.value;
  };

  _updateRiskCategory = function () {
    // update risk_category in the model
    _this.model.get('input').risk_category = _riskCategoriesEl.value;
  };

  _this.render = function () {
    var inputs = null;

    inputs = _this.model.get('input');

    if (inputs.title !== null) {
      _titleEl.value = inputs.title;
    }

    if (inputs.design_code !== null) {
      _getDesignCodes(inputs.design_code);
      _siteClassesEl.setAttribute('disabled', false);
      _riskCategoriesEl.setAttribute('disabled', false);
    } else {
      _getDesignCodes();
      // disable siteClassEl and riskCategoriesEl when design_code is null
      _siteClassesEl.setAttribute('disabled', true);
      _riskCategoriesEl.setAttribute('disabled', true);
    }

    if (inputs.site_class !== null) {
      _getSiteClasses(inputs.site_class);
    } else {
      _getSiteClasses();
    }

    if (inputs.risk_category !== null) {
      _getRiskCategories(inputs.risk_category);
    } else {
      _getRiskCategories();
    }

  };

  _initialize();
  params = null;
  return _this;

};

module.exports = NEHRP2015InputView;