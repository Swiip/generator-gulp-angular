'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

<% if (_.isEmpty(injectTaskDeps)) { %>
gulp.task('inject', function () {
<% } else { %>
gulp.task('inject', [<%= injectTaskDeps.join(', ') %>], function () {
<% } %>

  var injectStyles = gulp.src([
<% if (props.cssPreprocessor.key !== 'none') { %>
    paths.tmp + '/serve/{app,components}/**/*.css',
    '!' + paths.tmp + '/serve/app/vendor.css'
<% } else { %>
    paths.src + '/{app,components}/**/*.css'
<% } %>
  ], { read: false });

<% if (props.jsPreprocessor.srcExtension === 'ts') { %>
  var sortOutput = require('../' + paths.tmp + '/sortOutput.json');
<% } %>

  var injectScripts = gulp.src([
<% if (props.jsPreprocessor.key === 'none') { %>
    paths.src + '/{app,components}/**/*.js',
<% } else if (props.jsPreprocessor.extension === 'js') { %>
    paths.tmp + '/serve/{app,components}/**/*.js',
<% } else { %>
    '{' + paths.src + ',' + paths.tmp + '/serve}/{app,components}/**/*.js',
<% } %>
    '!' + paths.src + '/{app,components}/**/*.spec.js',
    '!' + paths.src + '/{app,components}/**/*.mock.js'
<% if (props.jsPreprocessor.srcExtension === 'ts') { %>
  ], { read: false })
  .pipe($.order(sortOutput, {base: paths.tmp + '/serve'}));
<% } else if (props.jsPreprocessor.srcExtension !== 'es6') { %>
  ])
  .pipe($.angularFilesort());
<% } else { %>
  ], { read: false });
<% } %>

  var injectOptions = {
    ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false
  };

  var wiredepOptions = {
    directory: 'bower_components'
<% if(wiredepExclusions.length > 0) { %>,
    exclude: [<%= wiredepExclusions.join(', ') %>]
<% } %>
  };

  return gulp.src(paths.src + '/*.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest(paths.tmp + '/serve'));

});
