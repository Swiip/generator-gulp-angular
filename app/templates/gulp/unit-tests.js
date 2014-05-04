'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

gulp.task('test', function() {
  var testFiles = [
    'app/bower_components/angular/angular.js',
    'app/bower_components/angular-route/angular-route.js',
    'app/bower_components/angular-mocks/angular-mocks.js',
    'app/scripts/**/*.js',
    'test/unit/**/*.js'
  ]

  return gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'test/karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});
