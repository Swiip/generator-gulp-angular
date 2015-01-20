'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

gulp.task('watch', ['inject'
<% if (props.htmlPreprocessor.key !== 'none') {%>,'markups'<% } %>
<% if (props.translateComponents === 'gettext') {%>,'gettext'<% } %>], function () {
  gulp.watch([
    paths.src + '/*.html',
    paths.src + '/{app,components}/**/*.<%= props.cssPreprocessor.extension %>',
    paths.src + '/{app,components}/**/*.js',
<% if (props.jsPreprocessor.extension !== 'js') { %>
    paths.src + '/{app,components}/**/*.<%= props.jsPreprocessor.extension %>',
<% } %>
    'bower.json'
  ], ['inject']);
<% if (props.htmlPreprocessor.key !== 'none') { %>
  gulp.watch(paths.src + '/{app,components}/**/*.<%= props.htmlPreprocessor.extension %>', ['markups']);
<% } %>
<% if (props.translateComponents === 'gettext') { %>
  gulp.watch([
    paths.src + '/*.html', paths.src + '/{app,components}/**/*.html',
    paths.tmp + '/serve/*.html', paths.tmp + '/serve/{app,components}/**/*.html'
  ], ['gettext:extract']);
  gulp.watch(paths.src + '/app/gettext/**/*.po', ['gettext:compile']);
<% } %>
});
