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

    model.props.jsPreprocessor.key = 'babel';
    model.props.jsPreprocessor.extension = 'js';
    result = unitTests(model);
    result.should.match(/options\.tmp \+ '\/serve\/app\/index\.module\.js/);

    model.props.jsPreprocessor.key = 'typescript';
    model.props.jsPreprocessor.extension = 'ts';
    result = unitTests(model);
    result.should.match(/options\.tmp \+ '\/serve[^\s]*!\(index\.module\)\.js/);
    result.should.match(/options\.tmp \+ '\/serve[^\s]*index\.module\.js/);

    model.props.jsPreprocessor.key = 'coffee';
    model.props.jsPreprocessor.extension = 'coffee';
    result = unitTests(model);
    result.should.match(/options\.tmp \+ '\/serve[^\s]*\.js/);
  });

  it('should create sortOutput.json for typescript', function() {
    model.props.jsPreprocessor.key = null;
    var result = unitTests(model);
    result.should.not.match(/sortOutput\.json/);

    model.props.jsPreprocessor.key = 'typescript';
    result = unitTests(model);
    result.should.match(/var sortOutput = require/);
  });

  it('should choose the right way to sort inject files', function() {
    model.props.jsPreprocessor.key = 'typescript';
    var result = unitTests(model);
    result.should.match(/\{ read: false \}\)\n.*\$\.order/);
    result.should.not.match(/angularFilesort/);

    model.props.jsPreprocessor.key = 'coffee';
    model.props.jsPreprocessor.extension = 'coffee';
    result = unitTests(model);
    result.should.match(/\$\.angularFilesort\(\)/);
    result.should.not.match(/order/);

    model.props.jsPreprocessor.extension = 'js';
    result = unitTests(model);
    result.should.not.match(/angularFilesort/);
    result.should.not.match(/order/);
  });

});
