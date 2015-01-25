'use strict';
/* jshint expr:true */

require('chai').should();

var mockPrompts = require('../../app/src/mock-prompts');

describe('gulp-angular generator mock prompts', function () {

  describe('libRegexp', function () {
    it('should return the right regexp', function () {
      var regexp = mockPrompts.libRegexp('name', 'version');
      regexp.test('test\ncontent\n\s\s\s\s"name": "version"\ntest\ncontent\n').should.be.true;
    });
  });

});
