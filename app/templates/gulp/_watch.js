'use strict';

var gulp = require('gulp');

var config = require('require-dir')('./config');

gulp.task('watch', [<% if (props.cssPreprocessor.key !== 'css') { %>'styles'<% } else { %>'wiredep'<% } %>] ,function () {<% if (props.cssPreprocessor.key === 'less') { %>
  gulp.watch(config.paths.app + '/{app,components}/**/*.less', ['styles']);<% } else if (props.cssPreprocessor.key === 'node-sass' || props.cssPreprocessor.key === 'ruby-sass') { %>
  gulp.watch(config.paths.app + '/{app,components}/**/*.scss', ['styles']);<% } %>
  gulp.watch(config.paths.app + '/{app,components}/**/*.js', ['scripts']);
  gulp.watch(config.paths.app + '/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
