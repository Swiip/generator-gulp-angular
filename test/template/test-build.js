'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular build template', function () {
  var build;
  var model;

  before(function () {
    return templateTools.load('gulp/_build.js')
      .then(function (templateModule) {
        build = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should add markups as dependency task if there is an htlm preprocessor', function () {
    model.props.htmlPreprocessor.key = 'noHtmlPrepro';
    var result = build(model);
    result.should.match(/gulp\.task\('partials', function/);

    model.props.htmlPreprocessor.key = 'jade';
    result = build(model);
    result.should.match(/gulp\.task\('partials', \['markups'\], function/);
  });

  it('should configure template cache with app name', function () {
    model.appName = 'testAppName';
    var result = build(model);
    result.should.match(/module: 'testAppName'/);
  });

  it('should replace bootstrap font paths', function () {
    model.computedPaths.appToBower = 'appToBower';
    model.props.ui.key = 'noUI';
    model.props.cssPreprocessor.extension = 'css';
    var result = build(model);
    result.should.not.match(/\$\.replace/);
    result.should.match(/mainBowerFiles\(\)\)/);

    model.props.ui.key = 'bootstrap';
    model.props.cssPreprocessor.extension = 'scss';
    result = build(model);
    result.should.match(/\$\.replace\('\.\.\/appToBower\/bower_components\/bootstrap-sass/);

    model.props.cssPreprocessor.extension = 'less';
    result = build(model);
    result.should.match(/\$\.replace\('\.\.\/appToBower\/bower_components\/bootstrap\//);

    model.props.cssPreprocessor.extension = 'styl';
    result = build(model);
    result.should.match(/\$\.replace\('\.\.\/appToBower\/bower_components\/bootstrap-stylus\//);
    result.should.match(/mainBowerFiles\(\).concat\('bower_components\/bootstrap-stylus\/fonts\/\*'\)/);
  });

  it('should replace material-design-iconfont font paths', function () {
    model.computedPaths.appToBower = 'appToBower';
    model.props.ui.key = 'material-design-lite';
    var result = build(model);
    result = build(model);
    result.should.match(/\$\.replace\('\.\.\/appToBower\/bower_components\/material-design-iconfont\/iconfont\//);
    result.should.match(/mainBowerFiles\(\).concat\('bower_components\/material-design-iconfont\/iconfont\/\*'\)/);
  });

  it('should use image min if selected', function () {
    model.imageMin = false;
    var result = build(model);
    result.should.not.match(/\$\.imagemin/);

    model.imageMin = true;
    result = build(model);
    result.should.match(/\$\.imagemin/);
  });

  it('should specify directory paths in clean task for typescript', function () {
    model.props.jsPreprocessor.key = 'typescript';
    var result = build(model);
    result.should.match(/conf.paths.tmp, '\/partials'/);
    result.should.match(/conf.paths.tmp, '\/serve'/);
  });
});
