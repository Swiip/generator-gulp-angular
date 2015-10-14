'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular eslint template', function () {
  var eslint;
  var model;

  before(function () {
    return templateTools.load('_.eslintrc')
      .then(function (templateModule) {
        eslint = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should add esnext for es6 js prepro', function () {
    model.props.jsPreprocessor.srcExtension = 'notes6';
    var result = eslint(model);
    result.should.not.match(/es6/);
    result.should.not.match(/ecmaFeatures/);

    model.props.jsPreprocessor.srcExtension = 'es6';
    result = eslint(model);
    result.should.match(/"es6": true/);
    result.should.match(/"ecmaFeatures": {/);
  });

});
