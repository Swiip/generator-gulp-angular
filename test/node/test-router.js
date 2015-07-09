'use strict';

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
      jsPreprocessor: {
        srcExtension: 'testSrcExtension',
        extension: 'testExtension'
      }
    };

    generator.files = [];
    generator.computeRouter();
    generator.routerHtml.should.match(/ng-view/);
    generator.files[0].src.should.equal('src/app/_ngroute/__ngroute.testSrcExtension');
    generator.files[0].dest.should.equal('src/app/index.route.testExtension');

    generator.files = [];
    generator.props.router.module = 'ui.router';
    generator.computeRouter();
    generator.routerHtml.should.match(/ui-view/);
    generator.files[0].src.should.equal('src/app/_uirouter/__uirouter.testSrcExtension');
    generator.files[0].dest.should.equal('src/app/index.route.testExtension');

    generator.files = [];
    read.withArgs('template/src/app/main/__testUi.html')
      .returns('<div class="container">');
    generator.props.router.module = 'none';
    generator.computeRouter();
    generator.routerHtml.should.match(/MainController/);
    generator.files.length.should.equal(0);
  });

});
