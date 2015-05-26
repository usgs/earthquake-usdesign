'use strict';

var View = require('mvc/View');

var NEHRP2015InputView = function (params) {
  var _this,
      _initialize,

      _buildForm;

  _this = View(params);

  _initialize = function () {
    _buildForm();
  };

  _buildForm = function () {
    _this.el.className = 'vertical';
    _this.el.innerHTML =
        '<label for="title">Title</label>' +
        '<input type="text" name="title" id="title" ' +
          'placeholder="Untitled Report" />' +
        '<div class="row">' +
          '<div class="column one-of-two">' +
            '<label for="location-view">Location</label>' +
            '<div class="location-view"></div>' +
          '</div>' +
          '<div class="column one-of-two">' +
            '<label for="design-code">Design Code</label>' +
            '<select name="design-code" id="design-code">' +
              '<option value="1">Option 1</option>' +
            '</select>' +
            '<label for="site-class">Site Class</label>' +
            '<select name="site-class" id="site-class">' +
              '<option value="1">Option 1</option>' +
            '</select>' +
            '<label for="risk-category">Risk Category</label>' +
            '<select name="risk-category" id="risk-category">' +
              '<option value="1">Option 1</option>' +
            '</select>' +
          '</div>' +
        '</div>';
  };

  _getSelectOptions = function () {

  };

  _initialize();
  params = null;
  return _this;

};

module.exports = NEHRP2015InputView;