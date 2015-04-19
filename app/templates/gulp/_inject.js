'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

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
<% if (props.jsPreprocessor.srcExtension === 'js' || props.jsPreprocessor.srcExtension === 'coffee') { %>
    ])
    .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'));
<% } else { %>
    ], { read: false });
<% } %>

    var injectOptions = {
      ignorePath: [options.src, options.tmp + '/serve'],
      addRootSlash: false
    };

    return gulp.src(options.src + '/*.html')
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(_.extend({}, options.wiredep)))
      .pipe(gulp.dest(options.tmp + '/serve'));

  });
};
