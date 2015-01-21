'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

var paths = gulp.paths;

function runTests (singleRun) {
  var bowerDeps = wiredep({
    directory: 'bower_components',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([
<% if (props.jsPreprocessor.key === 'none') { %>
    paths.src + '/{app,components}/**/*.js'
<% } else if (props.jsPreprocessor.extension === 'js') { %>
    paths.tmp + '/serve/app/index.js',
    paths.src + '/{app,components}/**/*.spec.js',
    paths.src + '/{app,components}/**/*.mock.js'
<% } else if (props.jsPreprocessor.key === 'typescript') { %>
    paths.tmp + '/serve/{app,components}/**/!(index).js',
    paths.tmp + '/serve/{app,components}/**/index.js',
    paths.src + '/{app,components}/**/*.spec.js',
    paths.src + '/{app,components}/**/*.mock.js'
<% } else { %>
    paths.tmp + '/serve/{app,components}/**/*.js',
    paths.src + '/{app,components}/**/*.spec.js',
    paths.src + '/{app,components}/**/*.mock.js'
<% } %>
  ]);

  return gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: (singleRun)? 'run': 'watch'
    }))
}

gulp.task('test',
<% if (props.jsPreprocessor.key !== 'none') { %>
<% if (props.jsPreprocessor.extension === 'traceur') {%> ['browserify'],
<% } else { %> ['scripts'],
<% } %>
<% } %> runTests.bind(this, true));
gulp.task('test:auto',
<% if (props.jsPreprocessor.key !== 'none') { %>
<% if (props.jsPreprocessor.key === 'traceur') {%> ['browserify'],
<% } else { %> ['scripts'],
<% } %>
<% } %> runTests.bind(this, false));
