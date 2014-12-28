'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

<% if(props.htmlPreprocessors.key !== 'none') { %>
gulp.task('watch', ['consolidate', 'wiredep', 'injector:css', 'injector:js'] ,function () {
<% } else { %>
gulp.task('watch', ['wiredep', 'injector:css', 'injector:js'] ,function () {
<% } %>
  gulp.watch(paths.src + '/{app,components}/**/*.<%= props.cssPreprocessor.extension %>', ['injector:css']);
<% if (props.jsPreprocessor.extension === 'js') { %>
  gulp.watch(paths.src + '/{app,components}/**/*.js', ['injector:js']);
<% } else { %>
  gulp.watch(paths.src + '/{app,components}/**/*.{js,<%= props.jsPreprocessor.extension %>}', ['injector:js']);
<% } %>
  gulp.watch(paths.src + '/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
<% _.forEach(consolidateExtensions, function(extension) {%>
  gulp.watch(paths.src + '/{app,components}/**/*.<%= extension %>', ['consolidate:<%= extension %>']);
<% }); %>
});
