'use strict';

var files = require('../app/src/write');
var data = require('../app/files.json');
var _ = require('lodash');
require('chai').should();

describe('gulp-angular generator files', function () {

  it('should loads files.json to compute files', function () {

    var actualCopy = 0;
    var actualTemplate = 0;

    files.call({
      srcTemplates: data.templates,
      staticFiles: data.staticFiles,
      _: _,
      fs: {
        copy: function(src, dest, options) {
          if(_.isObject(options) && _.isFunction(options.process)) {
            actualTemplate++;
          } else {
            actualCopy++;
          }
        }
      },
      templatePath: function (string) { return string; },
      destinationPath: function (string) { return string; }
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
