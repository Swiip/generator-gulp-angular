'use strict';

var gulp = require('gulp');

var paths = require('../.yo-rc.json')['generator-gulp-angular'].props.paths;

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src(paths.src + '/index.html')
    .pipe(wiredep({
      directory: 'bower_components'<% if(wiredepExclusions.length > 0) { %>,
      exclude: [<%= wiredepExclusions.join(', ') %>]<% } %>
    }))
    .pipe(gulp.dest(paths.src));
});
