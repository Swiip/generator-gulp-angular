'use strict';

var gulp = require('gulp');
<% if (props.jsPreprocessor.key === 'typescript') { %>
var mkdirp = require('mkdirp');
<% } %>
var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

gulp.task('scripts',
<% if (props.jsPreprocessor.key === 'typescript') { %> ['tsd:install'],
<% } %> function () {
<% if (props.jsPreprocessor.key === 'typescript') { %>
  mkdirp.sync(paths.tmp);
<% } %>

  return gulp.src(paths.src + '/{app,components}/**/*.<%= props.jsPreprocessor.extension %>')
<% if (props.jsPreprocessor.extension === 'js') { %>
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
<% } if (props.jsPreprocessor.key !== 'none') { %>
    .pipe($.sourcemaps.init())
<% } if (props.jsPreprocessor.key === '6to5') { %>
    .pipe($['6to5']())
<% } if (props.jsPreprocessor.key === 'traceur') { %>
    .pipe($.traceur())
<% } if (props.jsPreprocessor.key === 'coffee') { %>
    .pipe($.coffeelint())
    .pipe($.coffeelint.reporter())
    .pipe($.coffee())
<% } if (props.jsPreprocessor.key === 'typescript') { %>
    .pipe($.tslint())
    .pipe($.tslint.report('prose', {emitError: false}))
    .pipe($.typescript({sortOutput: true}))
<% } %>
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
<% if (props.jsPreprocessor.key !== 'none') { %>
    .pipe($.sourcemaps.write())
<% } %>
<% if (props.jsPreprocessor.key === 'typescript') { %>
    .pipe($.toJson({filename: paths.tmp + '/sortOutput.json', relative:true}))
<% } %>
<% if (props.jsPreprocessor.srcExtension === 'es6') { %>
    .pipe(gulp.dest(paths.tmp + '/<%= props.jsPreprocessor.key %>'))
<% } else if (props.jsPreprocessor.key !== 'none') { %>
    .pipe(gulp.dest(paths.tmp + '/serve/'))
<% } %>
    .pipe($.size());
});

<% if (props.jsPreprocessor.srcExtension === 'es6') { %>
gulp.task('browserify', ['scripts'], function () {
  return gulp.src(paths.tmp + '/<%= props.jsPreprocessor.key %>/app/index.js', { read: false })
    .pipe($.browserify())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest(paths.tmp + '/serve/app'))
    .pipe($.size());
});
<% } %>
