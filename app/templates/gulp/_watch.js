'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep'<% if(stylesBuild) { %>, 'styles'<% } %>] ,function () {
<% if(stylesBuild) { %>  gulp.watch('app/styles/**/*.<%= styleExtension %>', ['styles']);
<% } %>  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
