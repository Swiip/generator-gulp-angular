# Is there a way to change the output directory of fonts, scripts and styles?

## [#527](https://github.com/Swiip/generator-gulp-angular/issues/527) 

In your index.html search for the comments starting with <-- build. At the end, there is the target file name for the bundle, you can change it there.

Example:
<!-- build:css({.tmp/serve,src}) styles/vendor.css --> ->
<!-- build:css({.tmp/serve,src}) assets/styles/vendor.css -->

About images and fonts, you have to change paths in the gulp/build.js
