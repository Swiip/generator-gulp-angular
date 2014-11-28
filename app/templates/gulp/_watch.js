'use strict';

var gulp = require('gulp');

gulp.task('watch', ['scripts:injector', <% if (props.cssPreprocessor.key !== 'css') { %>'styles'<% } else { %>'wiredep'<% } %>] ,function () {<% if (props.cssPreprocessor.key === 'less') { %>
  gulp.watch('src/{app,components}/**/*.less', ['styles']);<% } else if (props.cssPreprocessor.key === 'node-sass' || props.cssPreprocessor.key === 'ruby-sass') { %>
  gulp.watch('src/{app,components}/**/*.scss', ['styles']);<% } %>
  gulp.watch('src/{app,components}/**/*.js', ['scripts:injector']);
  gulp.watch('src/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
