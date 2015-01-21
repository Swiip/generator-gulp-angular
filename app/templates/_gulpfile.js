'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.paths = {
  src: '<%= props.paths.src %>',
  dist: '<%= props.paths.dist %>',
  tmp: '<%= props.paths.tmp %>',
  e2e: '<%= props.paths.e2e %>'
};

gulp.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
