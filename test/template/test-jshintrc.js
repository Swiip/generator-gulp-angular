'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular jshint template', function () {
  var jshint, model;

  before(function() {
    return templateTools.load('_.jshintrc')
      .then(function(templateModule) {
        jshint = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should add esnext for es6 js prepro', function() {
    model.props.jsPreprocessor.srcExtension = 'notes6';
    var result = jshint(model);
    result.should.not.match(/esnext/);

    model.props.jsPreprocessor.srcExtension = 'es6';
    result = jshint(model);
    result.should.match(/"esnext": true/);
  });

});
