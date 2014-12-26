'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

function runTests (singleRun, done) {
  var bowerDeps = wiredep({
    directory: 'bower_components',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([ <% if (props.jsPreprocessor.key === 'none') { %>
    'src/{app,components}/**/*.js' <%
  } else if (props.jsPreprocessor.extension === 'js') { %>
    '.tmp/app/index.js',
    'src/{app,components}/**/*.spec.js',
    'src/{app,components}/**/*.mock.js' <%
  } else if (props.jsPreprocessor.key === 'typescript') { %>
    '.tmp/{app,components}/**/!(index).js',
    '.tmp/{app,components}/**/index.js',
    'src/{app,components}/**/*.spec.js',
    'src/{app,components}/**/*.mock.js' <%
  } else { %>
    '.tmp/{app,components}/**/*.js',
    'src/{app,components}/**/*.spec.js',
    'src/{app,components}/**/*.mock.js' <%
  } %>
  ]);

  gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: (singleRun)? 'run': 'watch'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
}

<% if (props.jsPreprocessor.key === 'none') { %>
  gulp.task('test', function (done) { runTests(true /* singleRun */, done) });
  gulp.task('test:auto', function (done) { runTests(false /* singleRun */, done) });
<% } else if (props.jsPreprocessor.extension === 'js') { %>
  gulp.task('test', ['browserify'], function (done) { runTests(true /* singleRun */, done) });
  gulp.task('test:auto', ['browserify'], function (done) { runTests(false /* singleRun */, done) });
<% } else { %>
  gulp.task('test', ['scripts'], function (done) { runTests(true /* singleRun */, done) });
  gulp.task('test:auto', ['scripts'], function (done) { runTests(false /* singleRun */, done) });
<% } %>
