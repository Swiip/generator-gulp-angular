gulp.task('styles', function () {
  return gulp.src('app/styles/*.less')
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});
