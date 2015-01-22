'use strict';

var utils = require('../app/src/utils');
var path = require('path');
require('chai').should();

describe('axi-dtsi-gulp-angular generator utils', function () {
  describe('normalizePath', function() {
    it('should return simplest form of given relative path to cwd', function () {
      utils.normalizePath('path' + path.sep + path.sep + 'to' + path.sep + 'folder' + path.sep).should.be.equal('path/to/folder');
      utils.normalizePath('..' + path.sep).should.be.equal('..');
    });
  });

  describe('isAbsolutePath', function() {
    it('should return true for absolute path', function() {
      utils.isAbsolutePath(path.sep + 'some' + path.sep + 'folder').should.be.equal(true);
    });
    
    it('should return false for relative path', function() {
      utils.isAbsolutePath(['some', 'relative', 'folder'].join(path.sep)).should.be.equal(false);
    });
  });

  describe('replacePrefix', function() {
    var folderPairs = {
      'src/path': 'some/dest/path',
      'some/folder': 'a',
      'some/folder/longer': 'b'
    };

    it('should replace source folder with dest folder from given path', function() {
      utils.replacePrefix('src/path/to/file.txt', folderPairs).should.be.equal('some/dest/path/to/file.txt');
    });

    it('should not replace anything if no source folder found as prefix', function() {
      utils.replacePrefix('pre/src/path/file.txt', folderPairs).should.be.equal('pre/src/path/file.txt');
      utils.replacePrefix('no/match/file.txt', folderPairs).should.be.equal('no/match/file.txt');
    });

    it('should choose longer match for ambiguous case', function() {
      utils.replacePrefix('some/folder/longer/some/file.txt', folderPairs).should.be.equal('b/some/file.txt');
    });
  });
});
