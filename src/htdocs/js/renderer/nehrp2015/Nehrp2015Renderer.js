'use strict';

var Nehrp2015Section_Summary =
        require('renderer/nehrp2015/Nehrp2015Section_Summary'),
    Nehrp2015Section_11_4_1 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_1'),
    Nehrp2015Section_11_4_2 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_2'),
    Nehrp2015Section_11_4_3 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_3'),
    Nehrp2015Section_11_4_4 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_4'),
    Nehrp2015Section_11_4_5 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_5'),
    Nehrp2015Section_11_4_6 =
        require('renderer/nehrp2015/Nehrp2015Section_11_4_6'),
    Nehrp2015Section_11_8_3 =
        require('renderer/nehrp2015/Nehrp2015Section_11_8_3');


var Nehrp2015Renderer = function (params) {
  var _this,
      _initialize,

      _sections;


  _this = {};

  _initialize = function (params) {
    params = params || {};

    _sections = params.sections || [
      Nehrp2015Section_Summary(),
      Nehrp2015Section_11_4_1(),
      Nehrp2015Section_11_4_2(),
      Nehrp2015Section_11_4_3(),
      Nehrp2015Section_11_4_4(),
      Nehrp2015Section_11_4_5(),
      Nehrp2015Section_11_4_6(),
      Nehrp2015Section_11_8_3()
    ];
  };


  _this.contentInDom = function () {
    _sections.forEach(function (section) {
      section.contentInDom();
    });
  };

  _this.getReport = function (model) {
    var content,
        fragment;

    fragment = document.createDocumentFragment();

    _sections.forEach(function (section) {
      content = section.getSection({section: null, model: model});

      if (content.section) {
        fragment.appendChild(content.section);
      }
    });

    return fragment;
  };


  _initialize(params);
  params = null;
  return _this;
};


module.exports = Nehrp2015Renderer;
