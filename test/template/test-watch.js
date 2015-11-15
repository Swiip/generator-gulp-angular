'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular watch template', function () {
  var watch;
  var model;

  before(function () {
    return templateTools.load('gulp/_watch.js')
      .then(function (templateModule) {
        watch = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should insert watch task dependencies', function () {
    model.watchTaskDeps = ['\'a\'', '\'b\'', '\'c\''];
    var result = watch(model);
    result.should.match(/gulp\.task\('watch', \['a', 'b', 'c'\], function/);
  });

  it('should watch the css preprocessor extension files and launch the styles task', function () {
    model.props.cssPreprocessor.key = 'noCssPrepro';
    model.props.cssPreprocessor.extension = 'css';
    var result = watch(model);
    result.should.match(/gulp\.watch\(.*\*\.css'/);
    result.should.match(/browserSync\.reload/);

    model.props.cssPreprocessor.key = 'notnone';
    model.props.cssPreprocessor.extension = 'notcss';
    result = watch(model);
    result.should.match(/gulp\.watch\(\[\n.*\.css'.*\n.*\.notcss'.*\n.*\],/);
    result.should.match(/gulp\.start\('styles-reload'\);/);
  });

  it('should watch the js preprocessor extension files', function () {
    model.props.jsPreprocessor.key = 'noJsPrepro';
    model.props.jsPreprocessor.extension = 'js';
    model.props.jsPreprocessor.srcExtension = 'notes6';
    var result = watch(model);
    result.should.match(/gulp\.watch\(.*\*\.js'/);
    result.should.match(/gulp\.start\('scripts-reload'\);/);

    model.props.jsPreprocessor.key = 'notnone';
    model.props.jsPreprocessor.extension = 'notjs';
    model.props.jsPreprocessor.srcExtension = 'notes6';
    result = watch(model);
    result.should.match(/gulp\.watch\(\[\n.*\.js'.*\n.*\.notjs'.*\n.*\],/);
    result.should.match(/gulp\.start\('scripts-reload'\);/);

    model.props.jsPreprocessor.key = 'notnone';
    model.props.jsPreprocessor.extension = 'notjs';
    model.props.jsPreprocessor.srcExtension = 'es6';
    result = watch(model);
    result.should.not.match(/gulp\.watch\(\[\n.*\.js'.*\n.*\.notjs'.*\n.*\],/);
    result.should.not.match(/gulp\.start\('scripts-reload'\);/);
  });

  it('should watch the html preprocessor extension files', function () {
    model.props.htmlPreprocessor.key = 'noHtmlPrepro';
    model.props.htmlPreprocessor.extension = 'html';
    var result = watch(model);
    result.should.not.match(/gulp\.watch.*\['markups'\]/);

    model.props.htmlPreprocessor.key = 'not none';
    model.props.htmlPreprocessor.extension = 'nothtml';
    result = watch(model);
    result.should.match(/gulp\.watch.*nothtml'.*\['markups'\]/);
  });

});
