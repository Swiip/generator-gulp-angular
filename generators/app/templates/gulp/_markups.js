'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('markups', function() {
  function renameToHtml(path) {
    path.extname = '.html';
  }

  return gulp.src(path.join(conf.paths.src, '/app/**/*.<%- props.htmlPreprocessor.extension %>'))
<% if (props.htmlPreprocessor.key === 'jade') { -%>
    .pipe($.consolidate('jade', { basedir: conf.paths.src, doctype: 'html', pretty: '  ' })).on('error', conf.errorHandler('Jade'))
<% } else if (props.htmlPreprocessor.key === 'haml') { -%>
    .pipe($.consolidate('haml')).on('error', conf.errorHandler('Haml'))
<% } else if (props.htmlPreprocessor.key === 'handlebars') { -%>
    .pipe($.consolidate('handlebars')).on('error', conf.errorHandler('Handlebars'))
<% } -%>
    .pipe($.rename(renameToHtml))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))
    .pipe(browserSync.stream());
});
