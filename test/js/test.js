/* global mocha */
'use strict';

// PhantomJS is missing native bind support,
//     https://github.com/ariya/phantomjs/issues/10522
// Polyfill from:
//     https://developer.mozilla.org
//         /en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5 internal IsCallable
      throw new TypeError('object to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound;

    fBound = function () {
      return fToBind.apply(
          (this instanceof fNOP && oThis ? this : oThis),
          aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}


// stub test data
(function () {
  var Xhr = require('util/Xhr'),
      usage = require('./usage');

  var ajax = Xhr.ajax;

  Xhr.ajax = function (options) {
    if (options.url.indexOf('usage.ws.php') !== -1) {
      console.log('Xhr.ajax(' + options.url + ') using stub,' +
          ' see test/js/test.js');
      options.success(usage);
    } else {
      ajax(options);
    }
  };
})();


(function () {
  mocha.ui('bdd');
  mocha.reporter('html');

  // Add each test class here as they are implemented
  require('./spec/ActionsView');
  require('./spec/SpectraGraphView');
  require('./spec/NEHRPCalc2015Test');
  require('./spec/CalculationTest');
  require('./spec/WebServiceAccessorTest');
  require('./spec/CalculationViewTest');
  require('./spec/NEHRP2015InputViewTest');

  require('./spec/util/D3GraphView');
  require('./spec/util/LookupDataFactoryTest');
  require('./spec/util/SiteAmplificationTest');

  if (window.mochaPhantomJS) {
      window.mochaPhantomJS.run();
  } else {
    mocha.run();
  }
})();
