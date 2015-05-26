'use strict';

var Collection = require('mvc/Colleciton'),
    View = require('mvc/View'),

    Util = require('util/Util');


var ActionsView = function (params) {
  var _this,
      _initialize,

      _collection,
      _destroyCollection;


  _this = View(params);

  _initialize = function (params) {
    _collection = params.collection;

    if (!_collection) {
      _collection = Collection([]);
      _destroyCollection = true;
    }
  };


  _this.destroy = Util.compose(function () {
    if (_destroyCollection) {
      _collection.destroy();
    }

    _collection = null;
    _destroyCollection = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);


  _initialize(params);
  params = null;
  return _this;
};

module.exports = ActionsView;
