/* global chai, sinon, describe, it, before, after */
'use strict';

var Calculation = require('Calculation'),
    WebServiceAccessor = require('WebServiceAccessor'),
    Xhr = require('util/Xhr');

var expect = chai.expect;

var input = {
          input:{
            latitude: 3.5,
            longitude: 1.0,
            design_code: 1,
            risk_category: 1,
            site_class: 1,
            title: 'tmp'
          }
        };

var calculation = Calculation(input);

var testResultData = {
  input: {
    title: 'Untitled Report',
    latitude: 3.4,
    longitude: 4.5,
    design_code: 1,
    risk_category: 1,
    site_class: 1
  },

  output: {
    metadata: {
      max_direction_ss: 1,
      max_direction_s1: 1,

      percentile_ss: 1,
      percentile_s1: 1,
      percentile_pga: 1,

      deterministic_floor_ss: 1,
      deterministic_floor_s1: 1,
      deterministic_floor_pga: 1
    },

    tl: null,

    data: [
      {
        latitude: 1,
        longitude: 1,

        mapped_ss: 1,
        crs: 1,
        geomean_ssd: 1,

        mapped_s1: 1,
        cr1: 1,
        geomean_s1d: 1,

        mapped_pga: 1,
        geomean_pgad: 1
      }
    ]
  }
};

var testUsageData =
  {'url':
  'http://localhost:8510/ws/{design_code_id}/' +
      '{site_class_id}/{risk_category_id}/{longitude}/{latitude}/{title}',
  'hazard_basis':[{
    'id':1,
    'name':'USGS hazard data available in 2014',
    'display_order':1,
    'design_code':[1]}],
  'design_code':[{
    'id':1,
    'name':'2015 NEHRP Provisions',
    'display_order':1,
    'hazard_basis':1,
    'site_classes':[1,2,3,4,5],
    'risk_categories':[1,2],
    'regions':[1]}],
  'region':[{
    'id':1,
    'name':'Alaska',
    'min_latitude':48,
    'max_latitude':72,
    'min_longitude':-200,
    'max_longitude':-125.1,
    'grid_spacing':0.05,
    'max_direction_ss':1.1,
    'max_direction_s1':1.3,
    'percentile_ss':1.8,
    'percentile_s1':1.8,
    'percentile_pga':1.8,
    'deterministic_floor_ss':1.5,
    'deterministic_floor_s1':0.6,
    'deterministic_floor_pga':0.5}],
  'site_class':[{
    'id':1,
    'name':'Hard Rock',
    'display_order':1,
    'value':'A'},
    {
      'id':2,
      'name':'Rock',
      'display_order':2,
      'value':'B'
    },
    {
      'id':3,
      'name':'Very Dense Soil and Soft Rock',
      'display_order':3,
      'value':'C'
    },
    {
      'id':4,
      'name':'Stiff Soil',
      'display_order':4,
      'value':'D'
    },
    {
      'id':5,
      'name':'Soft Clay Soil',
      'display_order':5,
      'value':'E'
    }],
  'risk_category':[
    {
      'id':1,
      'name':'I or II or III',
      'display_order':1
    },
    {
      'id':2,
      'name':'IV (eg. essential facilities)',
      'display_order':2
    }],
  'error':
      'Missing Parameter(s) ' +
          'site_class_id,risk_category_id,longitude,latitude,title'
};

describe('WebServiceAccessor', function () {
  describe('constructor', function () {
    it('can be instantiated', function () {
      var create = function () {
        WebServiceAccessor();
      };

      expect(create).not.to.throw(Error);
    });
  });

  describe('getUsage', function () {
    var stub;
    before(function () {
      stub = sinon.stub(Xhr, 'ajax', function (options) {
        options.success(testUsageData);
      });
    });
    after( function () {
      stub.restore();
    });

    it('Uses WebServiceAccessor class for usage data', function (done) {
      var webServiceAccessor = WebServiceAccessor();

      webServiceAccessor.getUsage(function () {
        expect(stub.callCount).to.equal(1);

        expect(stub.getCall(0).args[0].url).to.equal('service');
        done();
      });
    });
  });

  describe('getResults', function () {
    var stub;
    before(function () {
      stub = sinon.stub(Xhr, 'ajax', function (options) {
        options.success(testResultData);
      });
    });
    after( function () {
      stub.restore();
    });

    it('Uses WebServiceAccessor class for returned data', function (done) {
      var webServiceAccessor = WebServiceAccessor();

      webServiceAccessor.getResults(calculation, function () {
        expect(stub.callCount).to.equal(1);

        expect(stub.getCall(0).args[0].url).to.equal(
          'service/1/1/1/1/3.5/tmp'
        );
        done();
      });
    });
  });
});
