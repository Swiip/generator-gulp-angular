'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('src/{app,components}/*.scss')
    .pipe(wiredep({
      directory: 'bower_components',
      ignorePath: /^\/|\.\.\//
    }))
    .pipe(gulp.dest('src'));

  gulp.src('src/*.html')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [<%= wiredepExclusions %>],
      ignorePath: /^\/|\.\.\//
    }))
    .pipe(gulp.dest('src'));
});
