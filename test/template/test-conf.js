'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular conf template', function () {
  var conf;
  var model;

  before(function () {
    return templateTools.load('gulp/_conf.js')
      .then(function (templateModule) {
        conf = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should exports directories', function () {
    model.props.paths.src = 'test/src/dir';
    model.props.paths.tmp = 'test/tmp/dir';
    model.props.paths.dist = 'test/dist/dir';
    model.props.paths.e2e = 'test/e2e/dir';
    var result = conf(model);
    result.should.match(/exports\.paths = \{/);
    result.should.match(/src: 'test\/src\/dir'/);
    result.should.match(/tmp: 'test\/tmp\/dir'/);
    result.should.match(/dist: 'test\/dist\/dir'/);
    result.should.match(/e2e: 'test\/e2e\/dir'/);
  });

  it('should configure wiredep with wiredep exclusions', function () {
    model.wiredepExclusions = [];
    var result = conf(model);
    result.should.not.match(/exclude:/);

    model.wiredepExclusions = ['\'a\'', '\'b\''];
    result = conf(model);
    result.should.match(/exclude: \['a', 'b'\]/);
  });

});
