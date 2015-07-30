# Build without concat CSS files

## [#158](https://github.com/Swiip/generator-gulp-angular/issues/158)

I created a mini gulp module to solve this problem. But, I think that can be better, so I don't uploaded the module yet. Basically I have app.js file, and constants with array of files to load. Something like this:
```js
angular.module('app', [ngCssInjector])
.constant('mainViewCss', ['path/to/style1.css', 'path/to/style2.css',
'path/to/style3.css'])
.constant('loginViewCss', ['path/to/style2.css', 'path/to/style4.css',
'path/to/style5.css']).etc()
```
Then, cause I never injected that files on index.html, I take the files from the constant values in app.js and then just uglify and copy all files.
```js
gulp.task('copy-extra-files', function(){
  return gulp.src('src/app/app.js')
    .pipe(ngContantValues())
    .pipe(minifyCSS())
    .pipe(gulp.dest(relativeDir));
});
```
The project is responsible for injecting the files is in https://github.com/CristianMR/ngcssinjector
