'use strict';

var gulp = require('gulp');

gulp.task('watch', [<% if (!_.isEmpty(props.htmlPreprocessors)) { %>'consolidate', <% } %>'wiredep', 'injector:css', 'injector:js'] ,function () {
  gulp.watch('src/{app,components}/**/*.<%= props.cssPreprocessor.extension %>', ['injector:css']);<% if (props.jsPreprocessor.extension === 'js') { %>
  gulp.watch('src/{app,components}/**/*.js', ['injector:js']);<% } else { %>
  gulp.watch('src/{app,components}/**/*.{js,<%= props.jsPreprocessor.extension %>}', ['injector:js']);<% } %>
  gulp.watch('src/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);<% _.forEach(consolidateExtensions, function(extension) {%>
  gulp.watch('src/{app,components}/**/*.<%= extension %>', ['consolidate:<%= extension %>']);<% }); %>
});
