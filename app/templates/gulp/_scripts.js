'use strict';

var gulp = require('gulp');
<% if (props.jsPreprocessor.key === 'typescript') { %>
var mkdirp = require('mkdirp');
<% } if (props.jsPreprocessor.srcExtension === 'es6') { %>
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
<% } if (props.jsPreprocessor.key === '6to5') { %>
var to5ify = require('6to5ify');
<% } %>

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

<% if (props.jsPreprocessor.key === 'typescript') { %>
gulp.task('scripts', ['tsd:install'], function () {
  mkdirp.sync(paths.tmp);

<% } else { %>
gulp.task('scripts', function () {
<% } %>
<% if (props.jsPreprocessor.key !== '6to5') { %>
  return gulp.src(paths.src + '/{app,components}/**/*.<%= props.jsPreprocessor.extension %>')
<%   if (props.jsPreprocessor.extension === 'js') { %>
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
<%   } if (props.jsPreprocessor.key !== 'none') { %>
    .pipe($.sourcemaps.init())
<%   } if (props.jsPreprocessor.key === 'traceur') { %>
    .pipe($.traceur())
    .on('error', gulp.errorHandler('Traceur'))
<%   } if (props.jsPreprocessor.key === 'coffee') { %>
    .pipe($.coffeelint())
    .pipe($.coffeelint.reporter())
    .pipe($.coffee())
    .on('error', gulp.errorHandler('CoffeeScript'))
<%   } if (props.jsPreprocessor.key === 'typescript') { %>
    .pipe($.tslint())
    .pipe($.tslint.report('prose', { emitError: false }))
    .pipe($.typescript({sortOutput: true}))
    .on('error', gulp.errorHandler('TypeScript'))
<%   } %>
<%   if (props.jsPreprocessor.key !== 'none') { %>
    .pipe($.sourcemaps.write())
<%   } %>
<%   if (props.jsPreprocessor.key === 'typescript') { %>
    .pipe($.toJson({filename: paths.tmp + '/sortOutput.json', relative:true}))
<%   } %>
<%   if (props.jsPreprocessor.key === 'traceur') { %>
    .pipe(gulp.dest(paths.tmp + '/traceur'))
<%   } else if (props.jsPreprocessor.key !== 'none') { %>
    .pipe(gulp.dest(paths.tmp + '/serve/'))
<%   } %>
    .pipe($.size());
<% } else { %>
  return browserify({ debug: true })
    .add('./' + paths.src + '/app/index.js')
    .transform(to5ify)
    .bundle()
    .on('error', gulp.errorHandler('Browserify'))
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.tmp + '/serve/app'));
<% } %>
});

<% if (props.jsPreprocessor.key === 'traceur') { %>
gulp.task('browserify', ['scripts'], function () {
  return browserify({ debug: true })
    .add('./' + paths.tmp + '/<%= props.jsPreprocessor.key %>/app/index.js')
    .bundle()
    .on('error', gulp.errorHandler('Browserify'))
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.tmp + '/serve/app'));
});
<% } %>
