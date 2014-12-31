'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

<% if(_.isEmpty(props.htmlPreprocessors)) { %>
gulp.task('watch', ['inject'] ,function () {
<% } else { %>
gulp.task('watch', ['markups', 'inject'] ,function () {
<% } %>
  gulp.watch([
    paths.src + '/{app,components}/**/*.<%= props.cssPreprocessor.extension %>',
    paths.src + '/{app,components}/**/*.{js,<%= props.jsPreprocessor.extension %>}',
    'bower.json'
  ], ['inject']);
<% _.forEach(consolidateExtensions, function(extension) {%>
  gulp.watch(paths.src + '/{app,components}/**/*.<%= extension %>', ['consolidate:<%= extension %>']);
<% }); %>
});
