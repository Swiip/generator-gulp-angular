'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular watch template', function () {
  var watch, model;

  before(function() {
    return templateTools.load('gulp/_watch.js')
      .then(function(templateModule) {
        watch = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should add the markups task as deps if needed', function() {
    model.props.htmlPreprocessor.key = 'none';
    var result = watch(model);
    result.should.not.match(/markups/);

    model.props.htmlPreprocessor.key = 'not none';
    result = watch(model);
    result.should.match(/markups/);
  });

  it('should watch the js preprocessor extension files', function() {
    model.props.jsPreprocessor.extension = 'js';
    var result = watch(model);
    result.should.match(/gulp\.watch\(\[\n.*\n.*\n.*\n.*\n\s*\]/);

    model.props.jsPreprocessor.extension = 'notjs';
    result = watch(model);
    result.should.match(/options\.src \+ '[^\s]*\.notjs'/);
  });

  it('should watch the html preprocessor extension files', function() {
    model.props.htmlPreprocessor.key = 'none';
    model.props.htmlPreprocessor.extension = 'html';
    var result = watch(model);
    result.should.not.match(/gulp\.watch.*\['markups'\]/);

    model.props.htmlPreprocessor.key = 'not none';
    model.props.htmlPreprocessor.extension = 'nothtml';
    result = watch(model);
    result.should.match(/gulp\.watch.*nothtml', \['markups'\]/);
  });

});
