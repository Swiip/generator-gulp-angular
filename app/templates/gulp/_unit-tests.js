'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var karma = require('karma');

function runTests (singleRun, done) {
  karma.server.start({
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, function(failCount) {
    done(failCount ? new Error("Failed " + failCount + " tests.") : null);
  });
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
