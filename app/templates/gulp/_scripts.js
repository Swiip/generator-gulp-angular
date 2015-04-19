'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
<% if (props.jsPreprocessor.srcExtension !== 'es6') { %>
<%   if (props.jsPreprocessor.key === 'typescript') { %>
  var tsProject = $.typescript.createProject({
    sortOutput: true
  });

  gulp.task('scripts', ['tsd:install'], function () {
<%   } else { %>
  gulp.task('scripts', function () {
<%   } %>
    return gulp.src(options.src + '/app/**/*.<%= props.jsPreprocessor.extension %>')
<%   if (props.jsPreprocessor.extension === 'js') { %>
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
<%   } if (props.jsPreprocessor.key !== 'none') { %>
      .pipe($.sourcemaps.init())
<%   } if (props.jsPreprocessor.key === 'coffee') { %>
      .pipe($.coffeelint())
      .pipe($.coffeelint.reporter())
      .pipe($.coffee()).on('error', options.errorHandler('CoffeeScript'))
<%   } if (props.jsPreprocessor.key === 'typescript') { %>
      .pipe($.tslint())
      .pipe($.tslint.report('prose', { emitError: false }))
      .pipe($.typescript(tsProject)).on('error', options.errorHandler('TypeScript'))
      .pipe($.concat('index.js'))
<%   } if (props.jsPreprocessor.key !== 'none') { %>
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(options.tmp + '/serve/app'))
<%   } %>
      .pipe(browserSync.reload({ stream: true }))
      .pipe($.size());
  });
<% } else { %>
  function webpack(watch, callback) {
    var webpackOptions = {
      watch: watch,
      module: {
        preLoaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'jshint-loader'}],
<%   if (props.jsPreprocessor.key === 'babel') { %>
        loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}]
<%   } if (props.jsPreprocessor.key === 'traceur') { %>
        loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'traceur-loader'}]
<%   } %>
      },
      output: { filename: 'index.js' }
    };

    if(watch) {
      webpackOptions.devtool = 'inline-source-map';
    }

    var webpackChangeHandler = function(err, stats) {
      if(err) {
        options.errorHandler('Webpack')(err);
      }
      $.util.log(stats.toString({
        colors: $.util.colors.supportsColor,
        chunks: false,
        hash: false,
        version: false
      }));
      browserSync.reload();
      if(watch) {
        watch = false;
        callback();
      }
    };

    return gulp.src(options.src + '/app/index.js')
      .pipe($.webpack(webpackOptions, null, webpackChangeHandler))
      .pipe(gulp.dest(options.tmp + '/serve/app'));
  }

  gulp.task('scripts', function () {
    return webpack(false);
  });

  gulp.task('scripts:watch', ['scripts'], function (callback) {
    return webpack(true, callback);
  });
<% } %>
};
