'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular scripts template', function () {
  var scripts;
  var model;

  before(function () {
    return templateTools.load('gulp/_scripts.js')
      .then(function (templateModule) {
        scripts = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should add the right js preprocessor process', function () {
    model.props.jsPreprocessor.key = 'noJsPrepro';
    var result = scripts(model);
    result.should.not.match(/babel/);
    result.should.not.match(/coffee/);
    result.should.not.match(/traceur/);
    result.should.not.match(/typescript/);

    model.props.jsPreprocessor.key = 'coffee';
    model.props.jsPreprocessor.extension = 'coffee';
    result = scripts(model);
    result.should.match(/gulp\.src.*conf\.paths\.src, '.*\.coffee'/);
    result.should.match(/\$\.coffee\(/);
    result.should.match(/\$\.coffeelint\(/);
    result.should.not.match(/babel/);
    result.should.not.match(/traceur/);
    result.should.not.match(/typescript/);

    model.props.jsPreprocessor.key = 'typescript';
    model.props.jsPreprocessor.extension = 'ts';
    result = scripts(model);
    result.should.match(/function webpackWrapper\(watch, test, callback\)/);
    result.should.match(/loaders:.*loaders: \['ng-annotate', 'ts-loader'/);
    result.should.match(/gulp\.task\('scripts:watch'/);
    result.should.not.match(/babel/);
    result.should.not.match(/traceur/);
    result.should.not.match(/coffee/);

    model.props.jsPreprocessor.key = 'babel';
    model.props.jsPreprocessor.extension = 'js';
    model.props.jsPreprocessor.srcExtension = 'es6';
    result = scripts(model);
    result.should.match(/function webpackWrapper\(watch, test, callback\)/);
    result.should.match(/loaders:.*loaders: \['ng-annotate', 'babel-loader\?presets\[]=es2015'/);
    result.should.match(/gulp\.task\('scripts:watch'/);
    result.should.not.match(/traceur/);
    result.should.not.match(/coffee/);
    result.should.not.match(/typescript/);

    model.props.jsPreprocessor.key = 'traceur';
    model.props.jsPreprocessor.extension = 'js';
    model.props.jsPreprocessor.srcExtension = 'es6';
    result = scripts(model);
    result.should.match(/function webpackWrapper\(watch, test, callback\)/);
    result.should.match(/loaders:.*loaders: \['ng-annotate', 'traceur-loader'/);
    result.should.match(/gulp\.task\('scripts:watch'/);
    result.should.not.match(/babel/);
    result.should.not.match(/coffee/);
    result.should.not.match(/typescript/);
  });

});
