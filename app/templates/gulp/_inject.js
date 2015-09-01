'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

<% if (props.cssPreprocessor.key !== 'none') { -%>
gulp.task('inject', ['env-config','scripts', 'styles'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], { read: false });
<% } else { -%>
gulp.task('inject', ['env-config','scripts'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css')
  ], { read: false });
<% } -%>

  var injectScripts = gulp.src([
<% if (props.jsPreprocessor.srcExtension === 'es6' || props.jsPreprocessor.srcExtension === 'ts') { -%>
    path.join(conf.paths.tmp, '/serve/app/**/*.module.js')
<% } -%>
<% if (props.jsPreprocessor.srcExtension === 'js' || props.jsPreprocessor.srcExtension === 'coffee') { -%>
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
<%   if (props.jsPreprocessor.srcExtension === 'coffee') { -%>
    path.join(conf.paths.tmp, '/serve/app/**/*.module.js'),
    path.join(conf.paths.tmp, '/serve/app/**/*.js'),
    path.join('!' + conf.paths.tmp, '/serve/app/**/*.spec.js'),
    path.join('!' + conf.paths.tmp, '/serve/app/**/*.mock.js')
<%   } -%>
  ])
  .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));
<% } else {-%>
  ], { read: false });
<% } -%>

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
