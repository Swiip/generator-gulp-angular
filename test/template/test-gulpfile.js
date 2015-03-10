'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular gulpfile template', function () {
  var gulpfile, model;

  before(function() {
    return templateTools.load('_gulpfile.js')
      .then(function(templateModule) {
        gulpfile = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should ignore tmp and dist directories', function() {
    model.props.paths.src = 'test/src/dir';
    model.props.paths.tmp = 'test/tmp/dir';
    model.props.paths.dist = 'test/dist/dir';
    model.props.paths.e2e = 'test/e2e/dir';
    var result = gulpfile(model);
    result.should.match(/src: 'test\/src\/dir'/);
    result.should.match(/tmp: 'test\/tmp\/dir'/);
    result.should.match(/dist: 'test\/dist\/dir'/);
    result.should.match(/e2e: 'test\/e2e\/dir'/);
  });

});
