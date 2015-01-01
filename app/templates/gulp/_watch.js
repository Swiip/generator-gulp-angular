'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

<% if (props.htmlPreprocessor.extension === 'none') { %>
gulp.task('watch', ['inject'], function () {
<% } else { %>
gulp.task('watch', ['markups', 'inject'], function () {
<% } %>
  gulp.watch([
    paths.src + '/{app,components}/**/*.<%= props.cssPreprocessor.extension %>',
    paths.src + '/{app,components}/**/*.js',
<% if (props.jsPreprocessor.extension !== 'js') { %>
    paths.src + '/{app,components}/**/*.<%= props.jsPreprocessor.extension %>',
<% } %>
    'bower.json'
  ], ['inject']);
<% if (props.htmlPreprocessor.extension !== 'none') { %>
  gulp.watch(paths.src + '/{app,components}/**/*.<%= props.htmlPreprocessor.extension %>', ['markups']);
<% } %>
});
