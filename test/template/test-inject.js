'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular inject template', function () {
  var inject;
  var model;

  before(function () {
    return templateTools.load('gulp/_inject.js')
      .then(function (templateModule) {
        inject = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should inject styles for src or tmp depending on the css preprocessor', function () {
    model.props.cssPreprocessor.key = 'noCssPrepro';
    var result = inject(model);
    result.should.match(/gulp\.task\('inject', \['scripts'\], function/);
    result.should.match(/injectStyles = gulp\.src\(\[\n.*conf\.paths\.src/);

    model.props.cssPreprocessor.key = 'not none';
    result = inject(model);
    result.should.match(/gulp\.task\('inject', \['scripts', 'styles'\], function/);
    result.should.match(/injectStyles = gulp\.src\(\[\n.*conf\.paths\.tmp.*\n.*'!' \+ conf\.paths\.tmp/);
  });

  it('should inject scripts from src or tmp depending on the js preprocessor', function () {
    model.props.jsPreprocessor.srcExtension = 'js';
    var result = inject(model);
    result.should.match(/injectScripts[\s\S]*conf\.paths\.src[\s\S]*var injectOptions/);
    result.should.not.match(/injectScripts[\s\S]*conf\.paths\.tmp[\s\S]*var injectOptions/);

    model.props.jsPreprocessor.srcExtension = 'coffee';
    result = inject(model);
    result.should.match(/injectScripts[\s\S]*conf\.paths\.src[\s\S]*var injectOptions/);
    result.should.match(/injectScripts[\s\S]*conf\.paths\.tmp[\s\S]*var injectOptions/);

    model.props.jsPreprocessor.srcExtension = 'es6';
    result = inject(model);
    result.should.not.match(/injectScripts[\s\S]*conf\.paths\.src[\s\S]*var injectOptions/);
    result.should.match(/injectScripts[\s\S]*conf\.paths\.tmp[\s\S]*var injectOptions/);

    model.props.jsPreprocessor.srcExtension = 'ts';
    result = inject(model);
    result.should.not.match(/injectScripts[\s\S]*conf\.paths\.src[\s\S]*var injectOptions/);
    result.should.match(/injectScripts[\s\S]*conf\.paths\.tmp[\s\S]*var injectOptions/);
  });

  it('should choose the right way to sort inject files', function () {
    model.props.jsPreprocessor.srcExtension = 'coffee';
    var result = inject(model);
    result.should.match(/\$\.angularFilesort\(\)/);

    model.props.jsPreprocessor.srcExtension = 'es6';
    result = inject(model);
    result.should.not.match(/angularFilesort/);
  });

});
