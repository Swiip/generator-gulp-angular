'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src('src/index.html')
    .pipe(wiredep({
      directory: 'bower_components'
<% if(wiredepExclusions.length > 0) { %>,
      exclude: [<%= wiredepExclusions.join(', ') %>]
<% } %>
    }))
    .pipe(gulp.dest('src'));
});
