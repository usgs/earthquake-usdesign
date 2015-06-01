'use strict';

var Application = require('Application'),
    LookupDataFactory = require('util/LookupDataFactory');


var lookupFactory;


lookupFactory = LookupDataFactory({
  url: 'service'
});

lookupFactory.whenReady(function () {
  Application({
    el: document.querySelector('.application'),
    lookupFactory: lookupFactory
  });
});
