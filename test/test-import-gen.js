/*global describe, it*/
'use strict';
var assert = require('yeoman-generator').assert;

// Verify the generator can be imported within another generator
describe('gulp-angular generator', function () {
  it('can be imported without blowing up', function () {
    assert(require('../app') !== undefined);
  });
});
