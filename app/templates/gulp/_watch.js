'use strict';

var gulp = require('gulp');

var config = require('require-dir')('./config');

gulp.task('watch', ['wiredep', 'injector:css', 'injector:js'] ,function () {<% if (props.cssPreprocessor.key === 'less') { %>
  gulp.watch(config.paths.app + '/{app,components}/**/*.less', ['injector:css']);<% } else if (props.cssPreprocessor.key === 'node-sass' || props.cssPreprocessor.key === 'ruby-sass') { %>
  gulp.watch(config.paths.app + '/{app,components}/**/*.scss', ['injector:css']);<% } else if (props.cssPreprocessor.key === 'stylus') { %>
  gulp.watch(config.paths.app + '/{app,components}/**/*.styl', ['injector:css']);<% } else { %>
  gulp.watch(config.paths.app + '/{app,components}/**/*.css', ['injector:css']);<% } %>
  gulp.watch(config.paths.app + '/{app,components}/**/*.js', ['injector:js']);
  gulp.watch(config.paths.app + '/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
