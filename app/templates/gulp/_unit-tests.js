'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var karma = require('karma');

function runTests (singleRun, done) {
  var reporters = ['progress'];
  var preprocessors = {};
  if (singleRun) {
    var pathTmpJs = path.join(conf.paths.tmp, '/serve/app/index.module.js');
    preprocessors[pathTmpJs] = ['coverage'];
    reporters.push('coverage')
  }
  var pathSrcHtml = path.join(conf.paths.src, '/**/*.html');
  preprocessors[pathSrcHtml] = ['ng-html2js'];

  var localConfig = {
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  };

  localConfig.reporters = reporters;
  localConfig.preprocessors = preprocessors;

  var server = new karma.Server(localConfig, function(failCount) {
    done(failCount ? new Error("Failed " + failCount + " tests.") : null);
  })
  server.start();
}

<% if (props.jsPreprocessor.srcExtension !== 'es6' && props.jsPreprocessor.key !== 'typescript') { -%>
gulp.task('test', ['scripts'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
  runTests(false, done);
});
<% } else { -%>
gulp.task('test', ['scripts:test'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['scripts:test-watch'], function(done) {
  runTests(false, done);
});
<% } -%>
