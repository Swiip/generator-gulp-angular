'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular typings template', function () {
  var typings;
  var model;

  before(function () {
    return templateTools.load('_typings.json')
      .then(function (templateModule) {
        typings = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should insert default definitions', function () {
    model.props.paths.tmp = 'test/tmp/dir';
    var result = typings(model);
    result.should.match(/angularjs\/angular.d.ts/);
    result.should.match(/angularjs\/angular-mocks.d.ts/);
    result.should.match(/jasmine\/jasmine.d.ts/);
    result.should.match(/karma-jasmine\/karma-jasmine.d.ts/);
    result.should.match(/moment\/moment-node.d.ts/);
  });

  it('should insert angular modules definitions', function () {
    model.angularModulesObject = {
      animate: true,
      cookies: true,
      sanitize: true
    };
    var result = typings(model);
    result.should.match(/angularjs\/angular-animate.d.ts/);
    result.should.match(/angularjs\/angular-cookies.d.ts/);
    result.should.match(/angularjs\/angular-sanitize.d.ts/);
  });

  it('should insert jQuery definition', function () {
    model.props.jQuery.key = 'jquery2';
    var result = typings(model);
    result.should.match(/jquery\/jquery.d.ts/);
  });

  it('should insert Zepto definition', function () {
    model.props.jQuery.key = 'zepto';
    var result = typings(model);
    result.should.match(/zepto\/zepto.d.ts/);
  });

  it('should insert ngResource definition', function () {
    model.props.resource.key = 'angular-resource';
    var result = typings(model);
    result.should.match(/angularjs\/angular-resource.d.ts/);
  });

  it('should insert Restangular definition', function () {
    model.props.resource.key = 'restangular';
    var result = typings(model);
    result.should.match(/restangular\/restangular.d.ts/);
  });

  it('should insert UI-Router definition', function () {
    model.props.router.key = 'ui-router';
    var result = typings(model);
    result.should.match(/angular-ui-router\/angular-ui-router.d.ts/);
  });

  it('should insert ngRoute definition', function () {
    model.props.router.key = 'angular-route';
    var result = typings(model);
    result.should.match(/angularjs\/angular-route.d.ts/);
  });

  it('should insert Bootstrap definition', function () {
    model.props.ui.key = 'bootstrap';
    model.props.bootstrapComponents = 'official';
    var result = typings(model);
    result.should.match(/bootstrap\/bootstrap.d.ts/);
  });

  it('should insert Foundation definition', function () {
    model.props.ui.key = 'foundation';
    model.props.foundationComponents = 'official';
    var result = typings(model);
    result.should.match(/foundation\/foundation.d.ts/);
  });

  it('should insert Angular-Mateiral definition', function () {
    model.props.ui.key = 'angular-material';
    var result = typings(model);
    result.should.match(/angular-material\/angular-material.d.ts/);
  });

  it('should insert UI-Bootstrap definition', function () {
    model.props.ui.key = 'angular-material';
    var result = typings(model);
    result.should.match(/angular-ui-bootstrap\/angular-ui-bootstrap.d.ts/);
  });
});
