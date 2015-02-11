'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular tsd template', function () {
  var tsd, model;

  before(function() {
    return templateTools.load('_tsd.json')
      .then(function(templateModule) {
        tsd = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should insert tmp directory', function() {
    model.props.paths.tmp = 'test/tmp/dir';
    var result = tsd(model);
    result.should.match(/"path": "test\/tmp\/dir/);
    result.should.match(/"bundle": "test\/tmp\/dir/);
  });

});
