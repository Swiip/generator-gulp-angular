'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular scripts template', function () {
  var scripts, model;

  before(function() {
    return templateTools.load('gulp/_scripts.js')
      .then(function(templateModule) {
        scripts = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should require the needed modules', function() {
    model.props.jsPreprocessor.key = 'none';
    var result = scripts(model);
    result.should.match(/var browserSync = require\('browser-sync'\);\n\nvar \$/);

    model.props.jsPreprocessor.key = 'typescript';
    result = scripts(model);
    result.should.match(/require\('mkdirp'\);/);
    result.should.not.match(/babelify/);
  });

  it('should add tsd:install as dependencies for typescript', function() {
    model.props.jsPreprocessor.key = 'not typescript';
    var result = scripts(model);
    result.should.match(/gulp\.task\('scripts', function/);
    result.should.not.match(/mkdirp/);

    model.props.jsPreprocessor.key = 'typescript';
    result = scripts(model);
    result.should.match(/gulp\.task\('scripts', \['tsd:install'\]/);
    result.should.match(/mkdirp\.sync\(options\.tmp\);/);
  });

  it('should add the right js preprocessor process', function() {
    model.props.jsPreprocessor.key = 'none';
    var result = scripts(model);
    result.should.not.match(/babel/);
    result.should.not.match(/coffee/);
    result.should.not.match(/traceur/);
    result.should.not.match(/typescript/);

    model.props.jsPreprocessor.key = 'coffee';
    model.props.jsPreprocessor.extension = 'coffee';
    result = scripts(model);
    result.should.match(/gulp\.src\(options\.src \+ '[^\s]*\.coffee'\)/);
    result.should.match(/\$\.coffee\(/);
    result.should.match(/\$\.coffeelint\(/);
    result.should.not.match(/babel/);
    result.should.not.match(/traceur/);
    result.should.not.match(/typescript/);

    model.props.jsPreprocessor.key = 'typescript';
    model.props.jsPreprocessor.extension = 'ts';
    result = scripts(model);
    result.should.match(/gulp\.src\(options\.src \+ '[^\s]*\.ts'\)/);
    result.should.match(/\$\.tslint\(/);
    result.should.match(/\$\.typescript\(/);
    result.should.not.match(/babel/);
    result.should.not.match(/traceur/);
    result.should.not.match(/coffee/);

    model.props.jsPreprocessor.key = 'babel';
    model.props.jsPreprocessor.extension = 'js';
    model.props.jsPreprocessor.srcExtension = 'es6';
    result = scripts(model);
    result.should.match(/function webpack\(watch, callback\)/);
    result.should.match(/loaders:.*loader: 'babel-loader'/);
    result.should.match(/gulp\.task\('scripts:watch'/);
    result.should.not.match(/traceur/);
    result.should.not.match(/coffee/);
    result.should.not.match(/typescript/);

    model.props.jsPreprocessor.key = 'traceur';
    model.props.jsPreprocessor.extension = 'js';
    model.props.jsPreprocessor.srcExtension = 'es6';
    result = scripts(model);
    result.should.match(/function webpack\(watch, callback\)/);
    result.should.match(/loaders:.*loader: 'traceur-loader'/);
    result.should.match(/gulp\.task\('scripts:watch'/);
    result.should.not.match(/babel/);
    result.should.not.match(/coffee/);
    result.should.not.match(/typescript/);
  });

});
