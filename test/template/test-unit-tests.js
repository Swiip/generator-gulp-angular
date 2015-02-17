'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular unit tests template', function () {
  var unitTests, model;

  before(function() {
    return templateTools.load('gulp/_unit-tests.js')
      .then(function(templateModule) {
        unitTests = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should add options for each css preprocessors', function() {
    model.props.jsPreprocessor.key = 'none';
    var result = unitTests(model);
    result.should.match(/options\.src \+ '[^\s]*\.js/);

    model.props.jsPreprocessor.key = '6to5';
    model.props.jsPreprocessor.extension = 'js';
    result = unitTests(model);
    result.should.match(/options\.tmp \+ '\/serve\/app\/index\.js/);
    result.should.match(/options\.src \+ '[^\s]*spec\.js/);
    result.should.match(/options\.src \+ '[^\s]*mock\.js/);

    model.props.jsPreprocessor.key = 'typescript';
    model.props.jsPreprocessor.extension = 'ts';
    result = unitTests(model);
    result.should.match(/options\.tmp \+ '\/serve[^\s]*!\(index\)\.js/);
    result.should.match(/options\.tmp \+ '\/serve[^\s]*index\.js/);
    result.should.match(/options\.src \+ '[^\s]*spec\.js/);
    result.should.match(/options\.src \+ '[^\s]*mock\.js/);

    model.props.jsPreprocessor.key = 'coffee';
    model.props.jsPreprocessor.extension = 'coffee';
    result = unitTests(model);
    result.should.match(/options\.tmp \+ '\/serve[^\s]*\.js/);
    result.should.match(/options\.src \+ '[^\s]*spec\.js/);
    result.should.match(/options\.src \+ '[^\s]*mock\.js/);
  });

  it('should select the right deps for the test tasks', function() {
    model.props.jsPreprocessor.key = 'none';
    var result = unitTests(model);
    result.should.match(/task\('test', runTests\./);
    result.should.match(/task\('test:auto', runTests\./);

    model.props.jsPreprocessor.key = 'traceur';
    result = unitTests(model);
    result.should.match(/task\('test', \['browserify'\], runTests\./);
    result.should.match(/task\('test:auto', \['browserify'\], runTests\./);

    model.props.jsPreprocessor.key = 'not traceur';
    result = unitTests(model);
    result.should.match(/task\('test', \['scripts'\], runTests\./);
    result.should.match(/task\('test:auto', \['scripts'\], runTests\./);
  });

});
