'use strict';

var gulp = require('gulp');

gulp.task('watch', [<% if(stylesBuild) { %>'styles'<% } %>] ,function () {
<% if(stylesBuild) { %>  gulp.watch('src/{app,components}/**/*.<%= styleExtension %>', ['styles']);
<% } %>  gulp.watch('src/{app,components}/**/*.js', ['scripts']);
  gulp.watch('src/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
