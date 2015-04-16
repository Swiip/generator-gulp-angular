'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');

module.exports = function(options) {
  function listFiles(callback) {
    var wiredepOptions = _.extend({}, options.wiredep, {
      dependencies: true,
      devDependencies: true
    });
    var bowerDeps = wiredep(wiredepOptions);

    var specFiles = [
      options.src + '/**/*.spec.js',
      options.src + '/**/*.mock.js'
    ];

    var htmlFiles = [
      options.src + '/**/*.html'
    ];

    var srcFiles = [
<% if (props.jsPreprocessor.key === 'none') { %>
      options.src + '/app/**/*.module.js',
      options.src + '/app/**/*.js'
<% } else if (props.jsPreprocessor.extension === 'js') { %>
      options.tmp + '/serve/app/index.module.js'
<% } else if (props.jsPreprocessor.key === 'typescript') { %>
      options.tmp + '/serve/app/**/!(index.module).js',
      options.tmp + '/serve/app/**/index.module.js'
<% } else { %>
      options.src + '/serve/app/**/*.module.js',
      options.tmp + '/serve/app/**/*.js'
<% } %>
    ].concat(specFiles.map(function(file) {
      return '!' + file;
    }));

<% if (props.jsPreprocessor.key === 'typescript') { %>
    var sortOutput = require('../' + options.tmp + '/sortOutput.json');
<% } %>

<% if (props.jsPreprocessor.key === 'typescript') { %>
    gulp.src(srcFiles, { read: false })
      .pipe($.order(sortOutput, {base: options.tmp + '/serve/app'}))
<% } else if (props.jsPreprocessor.extension !== 'js') { %>
    gulp.src(srcFiles)
      .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'))
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
        configFile: __dirname + '/../karma.conf.js',
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
};
