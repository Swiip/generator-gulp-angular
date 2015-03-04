'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options) {
  gulp.task('inject', function () {
    var injectStyles = gulp.src([
<% if (props.cssPreprocessor.key !== 'none') { %>
      options.tmp + '/serve/{app,components}/**/*.css',
      '!' + options.tmp + '/serve/app/vendor.css'
<% } else { %>
      options.src + '/{app,components}/**/*.css'
<% } %>
    ], { read: false });

<% if (props.jsPreprocessor.srcExtension === 'ts') { %>
    var sortOutput = require('../' + options.tmp + '/sortOutput.json');
<% } %>

    var injectScripts = gulp.src([
<% if (props.jsPreprocessor.key === 'none') { %>
      options.src + '/{app,components}/**/*.js',
<% } else if (props.jsPreprocessor.extension === 'js') { %>
      options.tmp + '/serve/{app,components}/**/*.js',
<% } else { %>
      '{' + options.src + ',' + options.tmp + '/serve}/{app,components}/**/*.js',
<% } %>
      '!' + options.src + '/{app,components}/**/*.spec.js',
      '!' + options.src + '/{app,components}/**/*.mock.js'
<% if (props.jsPreprocessor.srcExtension === 'ts') { %>
    ], { read: false })
    .pipe($.order(sortOutput, {base: options.tmp + '/serve'}));
<% } else if (props.jsPreprocessor.srcExtension !== 'es6') { %>
    ])
    .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'));
<% } else { %>
    ], { read: false });
<% } %>

    var injectOptions = {
      ignorePath: [options.src, options.tmp + '/serve'],
      addRootSlash: false
    };

    var wiredepOptions = {
      directory: 'bower_components'
<% if(wiredepExclusions.length > 0) { %>,
      exclude: [<%= wiredepExclusions.join(', ') %>]
<% } %>
    };

    return gulp.src(options.src + '/*.html')
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(wiredepOptions))
      .pipe(gulp.dest(options.tmp + '/serve'));

  });
};
