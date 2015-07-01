# How to add gulp-react to a project?

## [#278](https://github.com/Swiip/generator-gulp-angular/issues/278)

You need to create javascript files using `react()` first and write them to a temporary directory, and then inject them with wiredep, you can't do all in a single step.

Create a task to compile JSX to JavaScript ...
```js
gulp.task('jsx', function () {
 return gulp.src([
    paths.src + '/{app,components}/**/*.jsx'
  ]).pipe(react())
 .dist(paths.tmp + '/jsx');
```

And then depend from this task to wiredep generated javascript files in index.html
```js
gulp.task('inject', ['styles', 'jsx'], function () { // Depend on jsx compile task
....
 var injectJSX = gulp.src([
    paths.tmp + '/jsx/**/*.js' // *.js because react() compiles to javascript
  ]).pipe(react());
...
return gulp.src(paths.src + '/*.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectJSX, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    ...
);
...
```

I didn't try, it may have caveats, but idea is there.
