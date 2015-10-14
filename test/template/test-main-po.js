'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular gitignore template', function () {
  var mainPo;
  var model;

  before(function () {
    return templateTools.load('e2e/_main.po.js')
      .then(function (templateModule) {
        mainPo = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should choose the right css class depending of the ui framework', function () {
    model.props.ui.key = 'bootstrap';
    var result = mainPo(model);
    result.should.match(/by\.css\('\.jumbotron'\)/);

    model.props.ui.key = 'foundation';
    result = mainPo(model);
    result.should.match(/by\.css\('\.panel'\)/);
  });

});
