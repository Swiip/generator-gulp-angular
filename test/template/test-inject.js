'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular inject template', function () {
  var inject, model;

  before(function() {
    return templateTools.load('gulp/_inject.js')
      .then(function(templateModule) {
        inject = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should inject styles for src or tmp depending on the css preprocessor', function() {
    model.props.cssPreprocessor.key = 'none';
    var result = inject(model);
    result.should.match(/gulp\.task\('inject', \['scripts'\], function/);
    result.should.match(/injectStyles = gulp\.src\(\[\n\s*options\.src/);

    model.props.cssPreprocessor.key = 'not none';
    result = inject(model);
    result.should.match(/gulp\.task\('inject', \['scripts', 'styles'\], function/);
    result.should.match(/injectStyles = gulp\.src\(\[\n\s*options\.tmp.*\n\s*'!' \+ options\.tmp/);
  });

  it('should create sortOutput.json for typescript', function() {
    model.props.jsPreprocessor.srcExtension = null;
    var result = inject(model);
    result.should.not.match(/sortOutput\.json/);

    model.props.jsPreprocessor.srcExtension = 'ts';
    result = inject(model);
    result.should.match(/var sortOutput = require/);
  });

  it('should inject scripts from src or tmp depending on the js preprocessor', function() {
    model.props.jsPreprocessor.key = 'none';
    model.props.jsPreprocessor.extension = 'js';
    var result = inject(model);
    result.should.match(/injectScripts = gulp\.src\(\[\n\s*options\.src/);

    model.props.jsPreprocessor.key = 'not none';
    result = inject(model);
    result.should.match(/injectScripts = gulp\.src\(\[\n\s*options\.tmp \+ '\/serve/);

    model.props.jsPreprocessor.extension = 'not js';
    result = inject(model);
    result.should.match(/injectScripts = gulp\.src\(\[\n\s*'\{' \+ options\.src \+ ',' \+ options\.tmp \+ '\/serve/);
  });

  it('should choose the right way to sort inject files', function() {
    model.props.jsPreprocessor.srcExtension = 'ts';
    var result = inject(model);
    result.should.match(/\{ read: false \}\)\n.*\$\.order/);
    result.should.not.match(/angularFilesort/);

    model.props.jsPreprocessor.srcExtension = 'coffee';
    result = inject(model);
    result.should.match(/\$\.angularFilesort\(\)/);
    result.should.not.match(/order/);

    model.props.jsPreprocessor.srcExtension = 'es6';
    result = inject(model);
    result.should.not.match(/angularFilesort/);
    result.should.not.match(/order/);
  });

  it('should configure wiredep with wiredep exclusions', function() {
    model.wiredepExclusions = [];
    var result = inject(model);
    result.should.not.match(/exclude:/);

    model.wiredepExclusions = ['\'a\'', '\'b\''];
    result = inject(model);
    result.should.match(/exclude: \['a', 'b'\]/);
  });

});
