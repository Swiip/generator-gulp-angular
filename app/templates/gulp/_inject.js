'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

<% if (props.htmlPreprocessor.key === 'noHtmlPrepro') { -%>
gulp.task('partials', function () {
<% } else { -%>
gulp.task('partials', ['markups'], function () {
<% } -%>
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: '<%- appName %>',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});


<% if (props.cssPreprocessor.key !== 'noCssPrepro') { -%>
gulp.task('inject', ['scripts', 'styles', 'partials'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], { read: false });
<% } else { -%>
gulp.task('inject', ['scripts', 'partials'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css')
  ], { read: false });
<% } -%>

  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };
        
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
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
