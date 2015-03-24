'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options) {
<% if (props.cssPreprocessor.key !== 'none') { %>
  gulp.task('inject', ['scripts', 'styles'], function () {
    var injectStyles = gulp.src([
      options.tmp + '/serve/app/**/*.css',
      '!' + options.tmp + '/serve/app/vendor.css'
    ], { read: false });
<% } else { %>
  gulp.task('inject', ['scripts'], function () {
    var injectStyles = gulp.src([
      options.src + '/app/**/*.css'
    ], { read: false });
<% } %>

<% if (props.jsPreprocessor.key === 'typescript') { %>
    var sortOutput = require('../' + options.tmp + '/sortOutput.json');
<% } %>

    var injectScripts = gulp.src([
<% if (props.jsPreprocessor.key === 'none') { %>
      options.src + '/app/**/*.js',
<% } else if (props.jsPreprocessor.extension === 'js') { %>
      options.tmp + '/serve/app/**/*.js',
<% } else { %>
      '{' + options.src + ',' + options.tmp + '/serve}/app/**/*.js',
<% } %>
      '!' + options.src + '/app/**/*.spec.js',
      '!' + options.src + '/app/**/*.mock.js'
<% if (props.jsPreprocessor.srcExtension === 'ts') { %>
    ], { read: false })
    .pipe($.order(sortOutput, {base: options.tmp + '/serve'}));
<% } else if (props.jsPreprocessor.srcExtension !== 'es6') { %>
    ])
    .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'));
<% } else { %>
    ], { read: false });
<% } %>

    var injectOptions = {
      ignorePath: [options.src, options.tmp + '/serve'],
      addRootSlash: false
    };

    var wiredepOptions = {
      directory: 'bower_components'
<% if(wiredepExclusions.length > 0) { %>,
      exclude: [<%= wiredepExclusions.join(', ') %>]
<% } %>
    };

    return gulp.src(options.src + '/*.html')
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(wiredepOptions))
      .pipe(gulp.dest(options.tmp + '/serve'));

  });
};
