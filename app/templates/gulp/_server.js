'use strict';

var gulp = require('gulp');

var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

var paths = gulp.paths;

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === paths.src || (util.isArray(baseDir) && baseDir.indexOf(paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
    browser: browser
  });

}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    paths.tmp,
    paths.src
  ], [
    <% if(props.cssPreprocessor.key === 'none') { %>paths.src<% } else { %>paths.tmp<% } %> + '/{app,components}/**/*.css',
    <% if(props.jsPreprocessor.key === 'none') { %>paths.src<% } else { %>paths.tmp<% } %> + '/{app,components}/**/*.js',
    paths.src + '/assets/images/**/*',
    paths.tmp + '/*.html',
    paths.tmp + '/{app,components}/**/*.html',
    paths.src + '/*.html',
    paths.src + '/{app,components}/**/*.html'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(paths.dist);
});

gulp.task('serve:e2e', ['wiredep', 'injector:js', 'injector:css'], function () {
  browserSyncInit([paths.tmp, paths.src], null, []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(paths.dist, null, []);
});
