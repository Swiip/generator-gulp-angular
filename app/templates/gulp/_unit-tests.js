'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');

function listFiles(callback) {
  var wiredepOptions = _.extend({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });
  var bowerDeps = wiredep(wiredepOptions);

  var specFiles = [
    path.join(conf.paths.src, '/**/*.spec.js'),
    path.join(conf.paths.src, '/**/*.mock.js')
  ];

  var htmlFiles = [
    path.join(conf.paths.src, '/**/*.html')
  ];

  var srcFiles = [
<% if (props.jsPreprocessor.key === 'none') { %>
    path.join(conf.paths.src, '/app/**/*.js')
<% } else if (props.jsPreprocessor.extension === 'js') { %>
    path.join(conf.paths.tmp, '/serve/app/index.js')
<% } else if (props.jsPreprocessor.key === 'typescript') { %>
    path.join(conf.paths.tmp, '/serve/app/**/!(index).js'),
    path.join(conf.paths.tmp, '/serve/app/**/index.js')
<% } else { %>
    path.join(conf.paths.tmp, '/serve/app/**/*.js')
<% } %>
  ].concat(specFiles.map(function(file) {
    return '!' + file;
  }));

<% if (props.jsPreprocessor.key === 'none' || props.jsPreprocessor.key === 'coffee') { %>
  gulp.src(srcFiles)
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'))
<% } else { %>
  gulp.src(srcFiles)
<% } %>
    .pipe(concat(function(files) {
      callback(bowerDeps.js
        .concat(_.pluck(files, 'path'))
        .concat(htmlFiles)
        .concat(specFiles));
    }));
}

function runTests (singleRun, done) {
  listFiles(function(files) {
    karma.server.start({
      configFile: path.join(__dirname, '/../karma.conf.js'),
      files: files,
      singleRun: singleRun,
      autoWatch: !singleRun
    }, done);
  });
}

gulp.task('test', ['scripts'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
  runTests(false, done);
});
