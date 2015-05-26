'use strict';

var Calculation = require('Calculation'),
    NEHRP2015InputView = require('NEHRP2015InputView');


NEHRP2015InputView({
  el: document.querySelector('#input-view'),
  model: Calculation()
});
