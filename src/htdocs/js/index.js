'use strict';

var Calculation = require('Calculation'),
    NEHRP2015InputView = require('NEHRP2015InputView');


NEHRP2015InputView({
  el: document.querySelector('#input-view'),
  model: Calculation({
    // mode: 'output',
    // input: {
    //   'title': 'My First Report',
    //   'latitude': 45,
    //   'longitude': -70.1,
    //   'design_code': 1,
    //   'site_class': 2,
    //   'risk_category': 2
    // }
  })
});
