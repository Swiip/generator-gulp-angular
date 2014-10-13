gulp.task('styles', ['wiredep'],  function () {
  return gulp.src('src/{app,components}/**/*.scss')
    .pipe($.sass({style: 'expanded'}))
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size());
});
