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

<% if (props.jsPreprocessor.key === 'none') { %>
  gulp.task('test', runTests.bind(this, true));
  gulp.task('test:auto', runTests.bind(this, true));
<% } else if (props.jsPreprocessor.key === 'traceur') { %>
  gulp.task('test', ['browserify'], runTests.bind(this, true));
  gulp.task('test:auto', ['browserify'], runTests.bind(this, true));
<% } else { %>
  gulp.task('test', ['scripts'], runTests.bind(this, true));
  gulp.task('test:auto', ['scripts'], runTests.bind(this, true));
<% } %>

};
