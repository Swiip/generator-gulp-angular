'use strict';

var gulp = require('gulp');

var paths = require('../.yo-rc.json')['generator-gulp-angular'].props.paths;

gulp.task('watch', [<% if (!_.isEmpty(props.htmlPreprocessors)) { %>'consolidate', <% } %>'wiredep', 'injector:css', 'injector:js'] ,function () {
  gulp.watch(paths.src + '/{app,components}/**/*.<%= props.cssPreprocessor.extension %>', ['injector:css']);<% if (props.jsPreprocessor.extension === 'js') { %>
  gulp.watch(paths.src + '/{app,components}/**/*.js', ['injector:js']);<% } else { %>
  gulp.watch(paths.src + '/{app,components}/**/*.{js,<%= props.jsPreprocessor.extension %>}', ['injector:js']);<% } %>
  gulp.watch(paths.src + '/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);<% _.forEach(consolidateExtensions, function(extension) {%>
  gulp.watch(paths.src + '/{app,components}/**/*.<%= extension %>', ['consolidate:<%= extension %>']);<% }); %>
});
