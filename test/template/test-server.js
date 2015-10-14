'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular server template', function () {
  var server;
  var model;

  before(function () {
    return templateTools.load('gulp/_server.js')
      .then(function (templateModule) {
        server = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should use qrCode module if selected', function () {
    model.qrCode = false;
    var result = server(model);
    result.should.not.match(/qrcode/);

    model.qrCode = true;
    result = server(model);
    result.should.match(/require\('qrcode-terminal'\)/);
    result.should.match(/qrcode\.generate/);
  });

});
