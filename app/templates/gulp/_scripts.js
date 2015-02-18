'use strict';

var gulp = require('gulp');
<% if (props.jsPreprocessor.key === 'typescript') { %>
var mkdirp = require('mkdirp');
<% } if (props.jsPreprocessor.srcExtension === 'es6') { %>
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
<% } if (props.jsPreprocessor.key === 'babel') { %>
var babelify = require('babelify');
<% } %>

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
<% if (props.jsPreprocessor.key === 'typescript') { %>
  gulp.task('scripts', ['tsd:install'], function () {
    mkdirp.sync(options.tmp);

<% } else { %>
  gulp.task('scripts', function () {
<% } %>
<% if (props.jsPreprocessor.key !== 'babel') { %>
    return gulp.src(options.src + '/{app,components}/**/*.<%= props.jsPreprocessor.extension %>')
<%   if (props.jsPreprocessor.extension === 'js') { %>
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
<%   } if (props.jsPreprocessor.key !== 'none') { %>
      .pipe($.sourcemaps.init())
<%   } if (props.jsPreprocessor.key === 'traceur') { %>
      .pipe($.traceur())
      .on('error', options.errorHandler('Traceur'))
<%   } if (props.jsPreprocessor.key === 'coffee') { %>
      .pipe($.coffeelint())
      .pipe($.coffeelint.reporter())
      .pipe($.coffee())
      .on('error', options.errorHandler('CoffeeScript'))
<%   } if (props.jsPreprocessor.key === 'typescript') { %>
      .pipe($.tslint())
      .pipe($.tslint.report('prose', { emitError: false }))
      .pipe($.typescript({sortOutput: true}))
      .on('error', options.errorHandler('TypeScript'))
<%   } %>
<%   if (props.jsPreprocessor.key !== 'none') { %>
      .pipe($.sourcemaps.write())
<%   } %>
<%   if (props.jsPreprocessor.key === 'typescript') { %>
      .pipe($.toJson({filename: options.tmp + '/sortOutput.json', relative:true}))
<%   } %>
<%   if (props.jsPreprocessor.key === 'traceur') { %>
      .pipe(gulp.dest(options.tmp + '/traceur'))
<%   } else if (props.jsPreprocessor.key !== 'none') { %>
      .pipe(gulp.dest(options.tmp + '/serve/'))
<%   } %>
      .pipe($.size());
<% } else { %>
    return browserify({ debug: true })
      .add('./' + options.src + '/app/index.js')
      .transform(babelify)
      .bundle()
      .on('error', options.errorHandler('Browserify'))
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(options.tmp + '/serve/app'));
<% } %>
  });

<% if (props.jsPreprocessor.key === 'traceur') { %>
  gulp.task('browserify', ['scripts'], function () {
    return browserify({ debug: true })
      .add('./' + options.tmp + '/<%= props.jsPreprocessor.key %>/app/index.js')
      .bundle()
      .on('error', options.errorHandler('Browserify'))
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(options.tmp + '/serve/app'));
  });
<% } %>
};
