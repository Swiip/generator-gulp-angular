'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', [<%- watchTaskDeps.join(', ') %>], function () {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

<% if (props.cssPreprocessor.extension === 'css') { -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.css'), function(event) {
<% } else { -%>
  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(conf.paths.src, '/app/**/*.<%- props.cssPreprocessor.extension %>')
  ], function(event) {
<% } -%>
    if(isOnlyChange(event)) {
<% if (props.cssPreprocessor.key === 'noCssPrepro') { -%>
      browserSync.reload(event.path);
<% } else { -%>
      gulp.start('styles-reload');
<% } -%>
    } else {
      gulp.start('inject-reload');
    }
  });

<% if (props.jsPreprocessor.srcExtension !== 'es6' && props.jsPreprocessor.srcExtension !== 'ts') { -%>
<%   if (props.jsPreprocessor.extension === 'js') { -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function(event) {
<%   } else { -%>
  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join(conf.paths.src, '/app/**/*.<%- props.jsPreprocessor.extension %>')
  ], function(event) {
<%   } -%>
    if(isOnlyChange(event)) {
      gulp.start('scripts-reload');
    } else {
      gulp.start('inject-reload');
    }
  });
<% } -%>

<% if (props.htmlPreprocessor.key !== 'noHtmlPrepro') { -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.<%- props.htmlPreprocessor.extension %>'), ['markups']);

<% } -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});
