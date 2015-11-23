# How can I build for a specific environment?

## [#460](https://github.com/Swiip/generator-gulp-angular/issues/460) [#650](https://github.com/Swiip/generator-gulp-angular/issues/650)

`generator-gulp-angular` does not yet have a way to build for different environments.

One way to do this is with [gulp-ng-constant](https://www.npmjs.com/package/gulp-ng-constant):

#### 1) Create a new gulp task called `config`.

This reads in the configuration in either `config.json` or `configDev.json`, based on the `NODE_ENV` environment variable and generates an Angular module with the contents to be included in your application.

```javascript
gulp.task('config', function () {
  var configPath = 'config.json';
  if (process.env.NODE_ENV === 'dev') {
    configPath = 'configDev.json';
  }
  return gulp.src(configPath)
    .pipe($.ngConstant())
    .pipe(gulp.dest('src/app/'));
});
```

*configDev.json*
```json
{
  "name": "myApp.config",
  "constants": {
    "config": {
      "apiBase": "https://localhost/v1"
    }
  }
}
```

*config.json*
```json
{
  "name": "myApp.config",
  "constants": {
    "config": {
      "apiBase": "https://api.example.com/v1"
    }
  }
}
```

#### 2) Add the `config` gulp task as a dependency of `scripts`.

```javascript
module.exports = function(options) {
  gulp.task('scripts', ['config'], function () {
    return gulp.src(options.src + '/app/**/*.js')
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe(browserSync.stream())
      .pipe($.size());
  });
};
```

#### 3) Use the generated module in your app.

```javascript
angular.module('myApp', ['myApp.config'])
  .service('apiService', ['config', function (config) {
    this.base = config.apiBase;
  });
```

#### 4) Run gulp with environment variable to build for the `dev` environment.

```bash
$ NODE_ENV=dev gulp serve
$ NODE_ENV=dev gulp
```
