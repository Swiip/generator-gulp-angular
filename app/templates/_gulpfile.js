'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var _ = require('lodash');
var wrench = require('wrench');

var options = {
  src: '<%= props.paths.src %>',
  dist: '<%= props.paths.dist %>',
  tmp: '<%= props.paths.tmp %>',
  e2e: '<%= props.paths.e2e %>',
  failOnLintErrors: true,
  failOnCompileErrors: true,
  errorHandler: function(title, error) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      if (error) {
        throw err;
      } else {
        this.emit('end');
      }
    };
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
