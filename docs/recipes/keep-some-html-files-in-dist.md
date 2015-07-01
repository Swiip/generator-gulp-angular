# How can exclude some HTML files from being added to the Angular cache?

## [#295](https://github.com/Swiip/generator-gulp-angular/issues/295)

1) Blacklist the .seo.html files during partials task
2) Copy the seo files afterwards into dist

```js
gulp.task('partials', function () {
  return gulp.src([
      'src/**/*.html',
      '!src/**/*.seo.html'
    ])
    .pipe(gulp.dest('.tmp/src'))
    .pipe($.size());
});

gulp.task('copy', function () {
  return gulp.src([
      'src/**/*.seo.html'
    ])
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', [
  'partials',
  'copy'
], function() {
    gulp.start('deploy');
});
```
