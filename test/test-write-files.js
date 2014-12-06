'use strict';

var write = require('../app/src/write');
var folders = require('../app/files.json');
var _ = require('lodash');
var path = require('path');
require('chai').should();

describe('gulp-angular generator files', function () {

  var mockPrompts = require('./mock-prompts.js');

  it('should loads files.json to compute files', function () {

    var actualCopy = 0;
    var actualTemplate = 0;

    write.call({
      props: mockPrompts.defaults,
      usedTechs: [],
      isVendorStylesPreprocessed: false,
      _: _,
      fs: {
        copy: function() { 
          if (path.basename(src).indexOf('__') !== 0) 
            actualCopy++;
        },
        copyTpl: function() { 
          if (path.basename(src).indexOf('__') !== 0) 
            actualTemplate++;
        }
      },
      templatePath: function (string) { return string; },
      destinationPath: function (string) { return string; }
    });

    var expectedCopy = 0;
    var expectedTemplate = 0;

    _.forEach(folders, function (folder) {
      expectedCopy += (folder.staticFiles.length + folder.dotFiles.length);
      expectedTemplate += folder.templates.length;
    });

    actualCopy.should.be.equal(expectedCopy);
    actualTemplate.should.be.equal(expectedTemplate);
  });

});
