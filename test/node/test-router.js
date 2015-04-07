'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Generator = require('./mock-generator');
var generator;

var router = require('../../app/src/router.js');

describe('gulp-angular generator techs script', function () {

  before(function() {
    router(Generator);
  });

  beforeEach(function() {
    generator = new Generator();
  });

  it('should prepare router files and html depending choices', function() {
    var read = sinon.stub(generator.fs, 'read');

    generator.props = {
      router: { module: 'ngRoute' },
      ui: { key: 'testUi' },
      jsPreprocessor: { srcExtension: 'testExtension' }
    };
    read.withArgs('template/src/app/_ngroute/__ngroute.testExtension')
      .returns('my test content 1');
    generator.computeRouter();
    generator.routerHtml.should.match(/ng-view/);
    generator.routerJs.should.equal('my test content 1');

    generator.props.router.module = 'ui.router';
    read.withArgs('template/src/app/_uirouter/__uirouter.testExtension')
      .returns('my test content 2');
    generator.computeRouter();
    generator.routerHtml.should.match(/ui-view/);
    generator.routerJs.should.equal('my test content 2');

    generator.props.router.module = 'none';
    read.withArgs('template/src/app/main/__testUi.html')
      .returns('<div class="container">');
    generator.computeRouter();
    generator.routerHtml.should.match(/MainController/);
    generator.routerJs.should.be.equal(';');
  });

});
