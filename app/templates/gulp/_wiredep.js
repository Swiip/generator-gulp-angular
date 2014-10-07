'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('src/{app,components}/*.scss')
    .pipe(wiredep({
        directory: 'src/bower_components'
    }))
    .pipe(gulp.dest('src'));

  gulp.src('src/*.html')
    .pipe(wiredep({
      directory: 'src/bower_components',
      exclude: [<%= wiredepExclusions %>]
    }))
    .pipe(gulp.dest('src'));
});
