'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Generator = require('./mock-generator');
var generator;

var router = require('../../generators/app/src/router.js');

describe('gulp-angular generator router script', function () {
  var read;

  before(function () {
    router(Generator);
  });

  beforeEach(function () {
    generator = new Generator();

    generator.props = {
      router: { key: 'angular-route' },
      ui: { key: 'testUi' },
      jsPreprocessor: {
        srcExtension: 'testSrcExtension',
        extension: 'testExtension'
      }
    };

    read = sinon.stub(generator.fs, 'read');
  });

  it('should prepare router files and html for angular route', function () {
    generator.files = [];
    generator.computeRouter();
    generator.routerHtml.should.match(/ng-view/);
    generator.files[0].src.should.equal('src/app/_ngroute/__ngroute.testSrcExtension');
    generator.files[0].dest.should.equal('src/app/index.route.testExtension');
  });

  it('should prepare router files and html for UI Router', function () {
    generator.files = [];
    generator.props.router.key = 'ui-router';
    generator.computeRouter();
    generator.routerHtml.should.match(/ui-view/);
    generator.files[0].src.should.equal('src/app/_uirouter/__uirouter.testSrcExtension');
    generator.files[0].dest.should.equal('src/app/index.route.testExtension');
  });

  it('should prepare router files and html for angular new router', function () {
    generator.files = [];
    generator.props.router.key = 'new-router';
    generator.computeRouter();
    generator.routerHtml.should.match(/ng-viewport/);
    generator.routerHtml.should.match(/RouterController/);
    generator.files[0].src.should.equal('src/app/_newrouter/__newrouter.testSrcExtension');
    generator.files[0].dest.should.equal('src/app/index.route.testExtension');
  });

  it('should prepare router files and html for not router', function () {
    generator.files = [];
    read.withArgs('template/src/app/main/__testUi.html')
      .returns('<div class="container">');
    generator.props.router.key = 'noRouter';
    generator.computeRouter();
    generator.routerHtml.should.match(/MainController/);
    generator.files.length.should.equal(0);
  });

});
