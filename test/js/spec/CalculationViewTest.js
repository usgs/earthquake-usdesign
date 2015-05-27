/* global chai, describe, it, sinon */
'use strict';

var Calculation = require('Calculation'),
    CalculationView = require('CalculationView');


var expect = chai.expect;


describe('CalculationView', function () {
  describe('Constructor', function () {
    it('can be required without blowing up', function () {
      expect(true).to.equal(true);
    });

    it('can be instantiated without any arguments', function () {
      var noArgConstructor = function () {
        CalculationView();
      };

      expect(noArgConstructor).to.not.throw(Error);
    });

    it('responds to the appropriate methods', function () {
      var view = CalculationView();

      expect(view).to.respondTo('render');
      expect(view).to.respondTo('destroy');
    });
  });

  describe('render', function () {
    it('is called when the model changes', function () {
      var model,
          renderSpy,
          view;

      model = Calculation();
      view = CalculationView({model: model});

      renderSpy = sinon.spy(view, 'render');
      model.trigger('change');

      expect(renderSpy.callCount).to.equal(1);

      renderSpy.restore();
    });
  });
});
