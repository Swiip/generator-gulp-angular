'use strict';

var gulp = require('gulp');

var config = require('require-dir')('./config');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src(config.paths.app + '/index.html')
    .pipe(wiredep({
      directory: 'bower_components'<% if(wiredepExclusions.length > 0) { %>,
      exclude: [<%= wiredepExclusions.join(', ') %>]<% } %>
    }))
    .pipe(gulp.dest(config.paths.app));
});
