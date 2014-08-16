gulp.task('styles', function () {
  return gulp.src('app/styles/*.less')
    .pipe($.plumber())
    .pipe($.less({style: 'expanded'}))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});
