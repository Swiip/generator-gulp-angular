'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var q = require('q');

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular index js template', function () {
  var model, indexJs, indexEs6, indexCoffee, indexTs;

  before(function() {
    return q.all([
      templateTools.load('src/app/_index.js'),
      templateTools.load('src/app/_index.es6'),
      templateTools.load('src/app/_index.coffee'),
      templateTools.load('src/app/_index.ts')
    ]).then(function(modules) {
      indexJs = modules[0];
      indexEs6 = modules[1];
      indexCoffee = modules[2];
      indexTs = modules[3];
    });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should name the module as the app name and add modules dependencies in the module declaration', function() {
    model.appName = 'testAppName';
    model.modulesDependencies = 'test value';
    var testJs = /angular\.module\('testAppName', \[test value\]\)/;
    var testCoffee = /angular\.module 'testAppName', \[test value\]/;
    var result = indexJs(model);
    result.should.match(testJs);
    result = indexEs6(model);
    result.should.match(testJs);
    result = indexCoffee(model);
    result.should.match(testCoffee);
    result = indexTs(model);
    result.should.match(testJs);
  });

  it('should add router js code', function() {
    model.routerJs = 'test value';
    var result = indexJs(model);
    result.should.match(/\]\)test value;/);
    result = indexEs6(model);
    result.should.match(/\ntest value;/);
    result = indexCoffee(model);
    result.should.match(/\]test value/);
    result = indexTs(model);
    result.should.match(/\ntest value;/);
  });

});
