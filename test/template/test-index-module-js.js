'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Promise = require('bluebird');

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular index js template', function () {
  var model;
  var indexJs;
  var indexEs6;
  var indexCoffee;
  var indexTs;

  before(function () {
    return Promise.all([
      templateTools.load('src/app/_index.module.js'),
      templateTools.load('src/app/_index.module.es6'),
      templateTools.load('src/app/_index.module.coffee'),
      templateTools.load('src/app/_index.module.ts')
    ]).then(function (modules) {
      indexJs = modules[0];
      indexEs6 = modules[1];
      indexCoffee = modules[2];
      indexTs = modules[3];
    });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should name the module as the app name and add modules dependencies in the module declaration', function () {
    model.appName = 'testAppName';
    model.modulesDependencies = 'test value';
    var testJs = /angular\n {4}\.module\('testAppName', \[test value\]\)/;
    var testEs6 = /angular\.module\('testAppName', \[test value\]\)/;
    var testTs = /angular\.module\('testAppName', \[test value\]\)/;
    var testCoffee = /angular\.module 'testAppName', \[test value\]/;
    var result = indexJs(model);
    result.should.match(testJs);
    result = indexEs6(model);
    result.should.match(testEs6);
    result = indexCoffee(model);
    result.should.match(testCoffee);
    result = indexTs(model);
    result.should.match(testTs);
  });

  it('should not add the router config for no router', function () {
    model.props.router.key = 'noRouter';
    var result = indexEs6(model);
    result.should.not.match(/\.config\(routerConfig\)/);
    result.should.not.match(/RouterController/);
    result = indexTs(model);
    result.should.not.match(/\.config\(routerConfig\)/);
    result.should.not.match(/RouterController/);
  });

  it('should add the router config when a router is chosen', function () {
    model.props.router.key = 'not-none';
    var result = indexEs6(model);
    result.should.match(/\.config\(routerConfig\)/);
    result.should.not.match(/RouterController/);
    result = indexTs(model);
    result.should.match(/\.config\(routerConfig\)/);
    result.should.not.match(/RouterController/);
  });

  it('should add the router controller for the angular new router', function () {
    model.props.router.key = 'new-router';
    var result = indexEs6(model);
    result.should.match(/\.controller\('RouterController', RouterController\)/);
    result = indexTs(model);
    result.should.match(/\.controller\('RouterController', RouterController\)/);
  });

});
