'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular package template', function () {
  var packageJson, model;

  before(function() {
    return templateTools.load('_package.json')
      .then(function(templateModule) {
        packageJson = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should put the right app name in the package.json', function() {
    model.appName = 'testAppName';
    var result = packageJson(model);
    result.should.match(/"name": "testAppName"/);
  });

  it('should add imageMin and/or qrCode if selected', function() {
    model.imageMin = true;
    model.qrCode = true;
    var result = packageJson(model);
    result.should.match(/gulp-imagemin/);
    result.should.match(/qrcode-terminal/);

    model.imageMin = false;
    model.qrCode = false;
    result = packageJson(model);
    result.should.not.match(/gulp-imagemin/);
    result.should.not.match(/qrcode-terminal/);
  });

  it('should add right dependencies depending css preprocessor selected', function() {
    model.props.cssPreprocessor.key = 'none';
    var result = packageJson(model);
    result.should.not.match(/sass/);
    result.should.not.match(/less/);
    result.should.not.match(/stylus/);

    model.props.cssPreprocessor.key = 'node-sass';
    result = packageJson(model);
    result.should.match(/gulp-sass/);
    result.should.not.match(/less/);
    result.should.not.match(/stylus/);

    model.props.cssPreprocessor.key = 'ruby-sass';
    result = packageJson(model);
    result.should.match(/gulp-ruby-sass/);
    result.should.not.match(/less/);
    result.should.not.match(/stylus/);

    model.props.cssPreprocessor.key = 'less';
    result = packageJson(model);
    result.should.match(/gulp-less/);
    result.should.not.match(/sass/);
    result.should.not.match(/stylus/);

    model.props.cssPreprocessor.key = 'stylus';
    result = packageJson(model);
    result.should.match(/gulp-stylus/);
    result.should.not.match(/sass/);
    result.should.not.match(/less/);
  });

  it('should add right dependencies depending js preprocessor selected', function() {
    model.props.jsPreprocessor.key = 'none';
    model.props.jsPreprocessor.srcExtension = 'js';
    var result = packageJson(model);
    result.should.not.match(/coffee/);
    result.should.not.match(/babel/);
    result.should.not.match(/traceur/);
    result.should.not.match(/typescript/);

    model.props.jsPreprocessor.key = 'coffee';
    model.props.jsPreprocessor.srcExtension = 'coffee';
    result = packageJson(model);
    result.should.match(/gulp-coffee"/);
    result.should.match(/gulp-coffeelint/);
    result.should.not.match(/babel/);
    result.should.not.match(/traceur/);
    result.should.not.match(/typescript/);

    model.props.jsPreprocessor.key = 'babel';
    model.props.jsPreprocessor.srcExtension = 'es6';
    result = packageJson(model);
    result.should.match(/browserify"/);
    result.should.match(/babelify/);
    result.should.not.match(/coffee/);
    result.should.not.match(/traceur/);
    result.should.not.match(/typescript/);

    model.props.jsPreprocessor.key = 'traceur';
    model.props.jsPreprocessor.srcExtension = 'es6';
    result = packageJson(model);
    result.should.match(/browserify"/);
    result.should.match(/gulp-traceur/);
    result.should.not.match(/coffee/);
    result.should.not.match(/babel/);
    result.should.not.match(/typescript/);

    model.props.jsPreprocessor.key = 'typescript';
    model.props.jsPreprocessor.srcExtension = 'ts';
    result = packageJson(model);
    result.should.match(/gulp-typescript"/);
    result.should.match(/gulp-tslint/);
    result.should.match(/tsd/);
    result.should.not.match(/coffee/);
    result.should.not.match(/babel/);
    result.should.not.match(/traceur/);
  });

  it('should add right dependencies depending html preprocessor selected', function() {
    model.props.htmlPreprocessor.key = 'none';
    var result = packageJson(model);
    result.should.not.match(/jade/);
    result.should.not.match(/haml/);
    result.should.not.match(/handlebars/);

    model.props.htmlPreprocessor.key = 'jade';
    result = packageJson(model);
    result.should.match(/jade/);
    result.should.not.match(/haml/);
    result.should.not.match(/handlebars/);

    model.props.htmlPreprocessor.key = 'haml';
    result = packageJson(model);
    result.should.match(/hamljs/);
    result.should.not.match(/jade/);
    result.should.not.match(/handlebars/);

    model.props.htmlPreprocessor.key = 'handlebars';
    result = packageJson(model);
    result.should.match(/handlebars/);
    result.should.not.match(/jade/);
    result.should.not.match(/haml/);
  });

});
