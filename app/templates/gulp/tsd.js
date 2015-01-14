'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var path = require('path');
var fs = require('fs');
var tsd = require('tsd');

var tsdJson = './tsd.json';
var tsdApi = new tsd.getAPI(tsdJson);

gulp.task('tsd:init', function () {
  if (!fs.existsSync(tsdJson)) {
    return tsdApi.initConfig();
  }
});

gulp.task('tsd:install', ['tsd:init'], function () {
  var bower = require(path.join(process.cwd(), 'bower.json'));

  var dependencies = [].concat(
    Object.keys(bower.dependencies),
    Object.keys(bower.devDependencies)
  );

  var query = new tsd.Query();
  dependencies.forEach(function (dependency) {
    query.addNamePattern(dependency);
  });

  var options = new tsd.Options();
  options.resolveDependencies = true;
  options.overwriteFiles = true;
  options.saveToConfig = true;

  return tsdApi.select(query, options)
    .then(function (selection) {
      return tsdApi.install(selection, options);
    }).then(function (installResult) {
      var written = Object.keys(installResult.written.dict);
      var removed = Object.keys(installResult.removed.dict);
      var skipped = Object.keys(installResult.skipped.dict);

      written.forEach(function (dts) {
        gutil.log('Definition file written: ' + dts);
      });

      removed.forEach(function (dts) {
        gutil.log('Definition file removed: ' + dts);
      });

      skipped.forEach(function (dts) {
        gutil.log('Definition file skipped: ' + dts);
      });
    });
});

gulp.task('tsd:purge', function () {
  return tsdApi.purge(true, true);
});

gulp.task('tsd', ['tsd:install']);
