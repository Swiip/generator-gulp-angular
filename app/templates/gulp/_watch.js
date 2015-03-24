'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
  gulp.task('watch', [<%= watchTaskDeps.join(', ') %>], function () {

    gulp.watch([options.src + '/*.html', 'bower.json'], ['inject']);

<% if (props.cssPreprocessor.extension === 'css') { %>
    gulp.watch(options.src + '/app/**/*.css', function(event) {
<% } else { %>
    gulp.watch([
      options.src + '/app/**/*.css',
      options.src + '/app/**/*.<%= props.cssPreprocessor.extension %>'
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

<% if (props.jsPreprocessor.srcExtension !== 'es6') { %>
<%   if (props.jsPreprocessor.extension === 'js') { %>
    gulp.watch(options.src + '/app/**/*.js', function(event) {
<%   } else { %>
    gulp.watch([
      options.src + '/app/**/*.js',
      options.src + '/app/**/*.<%= props.jsPreprocessor.extension %>'
    ], function(event) {
<%   } %>
      if(isOnlyChange(event)) {
        gulp.start('scripts');
      } else {
        gulp.start('inject');
      }
    });
<% } %>

<% if (props.htmlPreprocessor.key !== 'none') { %>
    gulp.watch(options.src + '/app/**/*.<%= props.htmlPreprocessor.extension %>', ['markups']);

<% } %>
    gulp.watch(options.src + '/app/**/*.html', function(event) {
      browserSync.reload(event.path);
    });
  });
};
