'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'injector:css', 'injector:js'] ,function () {<% if (props.cssPreprocessor.key === 'less') { %>
  gulp.watch('src/{app,components}/**/*.less', ['injector:css']);<% } else if (props.cssPreprocessor.key === 'node-sass' || props.cssPreprocessor.key === 'ruby-sass') { %>
  gulp.watch('src/{app,components}/**/*.scss', ['injector:css']);<% } else if (props.cssPreprocessor.key === 'stylus') { %>
  gulp.watch('src/{app,components}/**/*.styl', ['injector:css']);<% } else { %>
  gulp.watch('src/{app,components}/**/*.css', ['injector:css']);<% } %>
  gulp.watch('src/{app,components}/**/*.js', ['injector:js']);
  gulp.watch('src/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
