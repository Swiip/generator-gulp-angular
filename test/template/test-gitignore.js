'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular gitignore template', function () {
  var gitignore;
  var model;

  before(function () {
    return templateTools.load('_.gitignore')
      .then(function (templateModule) {
        gitignore = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should ignore tmp and dist directories', function () {
    model.props.paths.tmp = 'test/tmp/dir';
    model.props.paths.dist = 'test/dist/dir';
    var result = gitignore(model);
    result.should.match(/\ntest\/tmp\/dir\/\n/);
    result.should.match(/\ntest\/dist\/dir\/\n/);
  });

  it('should ignore typescript files when typescript chosen', function () {
    model.props.jsPreprocessor.key = 'noJsPrepro';
    var result = gitignore(model);
    result.should.not.match(/typings/);

    model.props.jsPreprocessor.key = 'typescript';
    result = gitignore(model);
    result.should.match(/typings/);
  });

});
