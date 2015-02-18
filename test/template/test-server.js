'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular server template', function () {
  var server, model;

  before(function() {
    return templateTools.load('gulp/_server.js')
      .then(function(templateModule) {
        server = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should use qrCode module if selected', function() {
    model.qrCode = false;
    var result = server(model);
    result.should.not.match(/qrcode/);

    model.qrCode = true;
    result = server(model);
    result.should.match(/require\('qrcode-terminal'\)/);
    result.should.match(/qrcode\.generate/);
  });

  it('should watch files from src or tmp depending of preprocessors', function() {
    model.props.cssPreprocessor.key = 'none';
    model.props.jsPreprocessor.key = 'none';
    var result = server(model);
    result.should.match(/options\.src \+ '[^\s]*\.css'/);
    result.should.match(/options\.src \+ '[^\s]*\.js'/);

    model.props.cssPreprocessor.key = 'not none';
    model.props.jsPreprocessor.key = 'not none';
    result = server(model);
    result.should.match(/options\.tmp \+ '\/serve[^\s]*\.css'/);
    result.should.match(/options\.tmp \+ '\/serve[^\s]*\.js'/);
  });

});
