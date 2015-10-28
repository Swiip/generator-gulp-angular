'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var karma = require('karma');

var pathSrcHtml = [
<% if (props.htmlPreprocessor.key === 'noHtmlPrepro') { -%>
  path.join(conf.paths.src, '/**/*.html')
<% } else { -%>
  path.join(conf.paths.tmp, '/serve/**/*.html'),
  path.join(conf.paths.src, '/**/*.html')
<% } -%>
];

var pathSrcJs = [
<% if (props.jsPreprocessor.key === 'noJsPrepro') { -%>
  path.join(conf.paths.src, '/**/!(*.spec).js')
<% } else if (props.jsPreprocessor.key === 'coffee') { -%>
  path.join(conf.paths.tmp, '/**/!(*.spec).js')
<% } else { -%>
  path.join(conf.paths.tmp, '/serve/app/index.module.js')
<% } -%>
];

function runTests (singleRun, done) {
  var reporters = ['progress'];
  var preprocessors = {};

  pathSrcHtml.forEach(function(path) {
    preprocessors[path] = ['ng-html2js'];
  });

  if (singleRun) {
    pathSrcJs.forEach(function(path) {
      preprocessors[path] = ['coverage'];
    });
    reporters.push('coverage')
  }

  var localConfig = {
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun,
    reporters: reporters,
    preprocessors: preprocessors
  };

  var server = new karma.Server(localConfig, function(failCount) {
    done(failCount ? new Error("Failed " + failCount + " tests.") : null);
  })
  server.start();
}

<% if (props.jsPreprocessor.srcExtension !== 'es6' && props.jsPreprocessor.key !== 'typescript') { -%>
gulp.task('test', ['scripts'<% if (props.htmlPreprocessor.key !== 'noHtmlPrepro') { %>, 'markups'<% } %>], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
  runTests(false, done);
});
<% } else { -%>
gulp.task('test', ['scripts:test'<% if (props.htmlPreprocessor.key !== 'noHtmlPrepro') { %>, 'markups'<% } %>], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['scripts:test-watch'], function(done) {
  runTests(false, done);
});
<% } -%>
