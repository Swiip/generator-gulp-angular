'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');

var gulpSync = require('gulp-sync')(gulp);

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

gulp.task('protractor-only', ['webdriver-update'], function (done) {
  var testFiles = [
    'test/e2e/**/*.js'
  ];

  gulp.src(testFiles)
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js',
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      // Close browser sync server
      browserSync.exit();
      done();
    });
});

gulp.task('protractor', gulpSync.sync(['serve:e2e', 'protractor-only']));
gulp.task('protractor:src', gulpSync.sync(['serve:e2e', 'protractor-only']));
gulp.task('protractor:dist', gulpSync.sync(['serve:e2e-dist', 'protractor-only']));
