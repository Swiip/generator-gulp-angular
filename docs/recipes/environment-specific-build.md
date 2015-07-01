# How can I have an environment specific build?

## [#460](https://github.com/Swiip/generator-gulp-angular/issues/460)

Nope we don't have equivalent.
But I think you can choose different Firebase more simply with [gulp-ng-constant](https://www.npmjs.com/package/gulp-ng-constant)


#### 1) create a new task `config`
```javascript
gulp.task('config', function () {
  var configPath = 'config.json';
  if (process.env.NODE_ENV === 'test') {
    configPath = 'configTest.json';
  }
  return gulp.src(configPath)
    .pipe($.ngConstant())
    .pipe(gulp.dest('src/app/'));
});
```
#### 2) add config as a dependency of scripts
```javascript
module.exports = function(options) {
  gulp.task('scripts', ['config'], function () {
    return gulp.src(options.src + '/app/**/*.js')
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe(browserSync.reload({ stream: true }))
      .pipe($.size());
  });
};
```
#### 3) use the module constante created in your app

#### 4) run gulp with environnement variable
```
$ NODE_ENV=test gulp serve
$ NODE_ENV=test gulp
```

Anyway if you use gulp-preprocess, PR is welcome (to add in advanced option)
