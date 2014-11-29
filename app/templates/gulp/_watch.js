'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'injector:css', 'injector:js'] ,function () {<% if (props.cssPreprocessor.key !== 'none') { %>
  gulp.watch('src/{app,components}/**/*.<%= props.cssPreprocessor.extension %>', ['injector:css']);<% } %>
  gulp.watch('src/{app,components}/**/*.<%= props.jsPreprocessor.extension %>', ['injector:js']);
  gulp.watch('src/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
