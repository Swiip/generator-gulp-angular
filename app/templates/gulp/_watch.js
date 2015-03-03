'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
<% if (props.htmlPreprocessor.key === 'none') { %>
  gulp.task('watch', ['inject'], function () {
<% } else { %>
  gulp.task('watch', ['markups', 'inject'], function () {
<% } %>

    gulp.watch([options.src + '/*.html', 'bower.json'], ['inject']);

<% if (props.cssPreprocessor.extension === 'css') { %>
    gulp.watch(options.src + '/{app,components}/**/*.css', function(event) {
<% } else { %>
    gulp.watch([
      options.src + '/{app,components}/**/*.css',
      options.src + '/{app,components}/**/*.<%= props.cssPreprocessor.extension %>'
    ], function(event) {
<% } %>
      if(isOnlyChange(event)) {
<% if (props.cssPreprocessor.key === 'none') { %>
        browserSync.reload(event.path);
<% } else { %>
        gulp.start('styles');
<% } %>
      } else {
        gulp.start('inject');
      }
    });

<% if (props.jsPreprocessor.extension === 'js') { %>
    gulp.watch(options.src + '/{app,components}/**/*.js', function(event) {
<% } else { %>
    gulp.watch([
      options.src + '/{app,components}/**/*.js',
      options.src + '/{app,components}/**/*.<%= props.jsPreprocessor.extension %>'
    ], function(event) {
<% } %>
      if(isOnlyChange(event)) {
<% if (props.jsPreprocessor.key === 'none') { %>
        browserSync.reload(event.path);
<% } else if (props.jsPreprocessor.key !== 'traceur') { %>
        gulp.start('scripts');
<% } else { %>
        gulp.start('browserify');
<% } %>
      } else {
        gulp.start('inject');
      }
    });

<% if (props.htmlPreprocessor.key !== 'none') { %>
    gulp.watch(options.src + '/{app,components}/**/*.<%= props.htmlPreprocessor.extension %>', ['markups']);
<% } %>
  });
};
