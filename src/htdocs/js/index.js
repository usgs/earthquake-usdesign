'use strict';

var NEHRP2015InputView = require('NEHRP2015InputView'),

    Collection = require('mvc/Collection');

NEHRP2015InputView({
  el: document.querySelector('#input-view'),
  collection: Collection()
});