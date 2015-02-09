'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

module.exports = function(options) {
  function runTests (singleRun) {
    var bowerDeps = wiredep({
      directory: 'bower_components',
      exclude: ['bootstrap-sass-official'],
      dependencies: true,
      devDependencies: true
    });

    var testFiles = bowerDeps.js.concat([
  <% if (props.jsPreprocessor.key === 'none') { %>
      options.src + '/{app,components}/**/*.js'
  <% } else if (props.jsPreprocessor.extension === 'js') { %>
      options.tmp + '/serve/app/index.js',
      options.src + '/{app,components}/**/*.spec.js',
      options.src + '/{app,components}/**/*.mock.js'
  <% } else if (props.jsPreprocessor.key === 'typescript') { %>
      options.tmp + '/serve/{app,components}/**/!(index).js',
      options.tmp + '/serve/{app,components}/**/index.js',
      options.src + '/{app,components}/**/*.spec.js',
      options.src + '/{app,components}/**/*.mock.js'
  <% } else { %>
      options.tmp + '/serve/{app,components}/**/*.js',
      options.src + '/{app,components}/**/*.spec.js',
      options.src + '/{app,components}/**/*.mock.js'
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
};
