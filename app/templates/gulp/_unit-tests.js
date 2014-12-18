'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
<% if (props.jsPreprocessor.key === 'none') { %>
gulp.task('test', function() { <% } else if (props.jsPreprocessor.extension === 'js') { %>
gulp.task('test', ['browserify'], function() { <% } else { %>
gulp.task('test', ['scripts'], function() { <% } %>
  var bowerDeps = wiredep({
    directory: 'bower_components',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([<% if (props.jsPreprocessor.key === 'none') { %>
    'src/{app,components}/**/*.js'<% } else if (props.jsPreprocessor.extension === 'js') { %>
    '.tmp/app/index.js',
    'src/{app,components}/**/*.spec.js',
    'src/{app,components}/**/*.mock.js'<% } else if (props.jsPreprocessor.key === 'typescript') { %>
    '.tmp/{app,components}/**/!(index).js',
    '.tmp/{app,components}/**/index.js',
    'src/{app,components}/**/*.spec.js',
    'src/{app,components}/**/*.mock.js'<% } else { %>
    '.tmp/{app,components}/**/*.js',
    'src/{app,components}/**/*.spec.js',
    'src/{app,components}/**/*.mock.js'<% } %>
  ]);

  return gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});
