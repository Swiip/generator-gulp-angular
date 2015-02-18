'use strict';

var gulp = require('gulp');

module.exports = function(options) {
<% if (props.htmlPreprocessor.key === 'none') { %>
  gulp.task('watch', ['inject'], function () {
<% } else { %>
  gulp.task('watch', ['markups', 'inject'], function () {
<% } %>
    gulp.watch([
      options.src + '/*.html',
      options.src + '/{app,components}/**/*.<%= props.cssPreprocessor.extension %>',
      options.src + '/{app,components}/**/*.js',
<% if (props.jsPreprocessor.extension !== 'js') { %>
      options.src + '/{app,components}/**/*.<%= props.jsPreprocessor.extension %>',
<% } %>
      'bower.json'
    ], ['inject']);
<% if (props.htmlPreprocessor.key !== 'none') { %>
    gulp.watch(options.src + '/{app,components}/**/*.<%= props.htmlPreprocessor.extension %>', ['markups']);
<% } %>
  });
};
