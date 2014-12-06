'use strict';

/**
 * Test Prompts validator and filter functions
 */

var _ = require('lodash');
var prompts = require('../app/prompts');
require('chai').should();

describe('gulp-angular generator validators & filters', function() {
  describe('Prompt 1: appPath', function() {

    var question = _.findWhere(prompts, {name: 'appPath'});

    describe('validator', function() {
      var invalidAppPaths = [
        '../path/to/src',
        '~/path/to/src',
        '/path/to/src',
        'path/../../to/src'
      ];
      invalidAppPaths.forEach(function(invalidAppPath) {
        it('should return false for invalid path \'' + invalidAppPath + '\'', function() {
          var actual = question.validate(invalidAppPath);
          actual.should.be.equal(false);
        });
      });

      var validAppPaths = [
        'src',
        'very/long/path/to/src',
        'path/to/src/'
      ];
      validAppPaths.forEach(function(validAppPath) {
        it('should return true for valid path \'' + validAppPath + '\'', function() {
          var actual = question.validate(validAppPath);
          actual.should.be.equal(true);
        });
      });
    });

    describe('filter', function() {
      var testCases = [{
        input: ' src/ ',
        expectedOutput: 'src'
      }, {
        input: '  path/to/src   ',
        expectedOutput: 'path/to/src'
      }, {
        input: ' path/to/src/   ',
        expectedOutput: 'path/to/src'
      }];
      testCases.forEach(function(testCase) {
        it('should trim input path \'' + testCase.input +'\' into \'' + testCase.expectedOutput + '\'', function() {
          question.filter(testCase.input).should.be.equal(testCase.expectedOutput);
        });
      });
    });
  });
});
