'use strict';

var files = require('../app/src/files');
var data = require('../app/files.json');
var _ = require('lodash');
require('chai').should();

describe('gulp-angular generator files', function () {

  it('should loads files.json to compute files', function () {

    var actualCopy = 0;
    var actualTemplate = 0;

    files.call({
      _: _,
      copy: function() { actualCopy++; },
      template: function() { actualTemplate++; }
    });

    var expectedCopy =
      data.staticFiles.length +
      data.dotFiles.length;

    var expectedTemplate =
      data.templates.length;

    actualCopy.should.be.equal(expectedCopy);
    actualTemplate.should.be.equal(expectedTemplate);
  });

});
