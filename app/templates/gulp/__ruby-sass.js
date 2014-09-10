gulp.task('styles', function () {
  return gulp.src('app/styles/*.scss')
    .pipe($.rubySass({style: 'expanded'}))
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});
