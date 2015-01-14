'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');
<% if(qrCode) { %>

var qrcode = require('qrcode-terminal');
<% } %>

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
<% if(qrCode) { %>
  }, function(err, bs) {
    qrcode.generate(bs.options.urls.external);
  });
<% } else { %>
  });
<% } %>
}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    paths.tmp + '/serve',
    paths.src
  ], [
<% if(props.cssPreprocessor.key === 'none') { %>
    paths.src + '/{app,components}/**/*.css',
<% } else { %>
    paths.tmp + '/serve/{app,components}/**/*.css',
<% } if(props.jsPreprocessor.key === 'none') { %>
    paths.src + '/{app,components}/**/*.js',
<% } else { %>
    paths.tmp + '/serve/{app,components}/**/*.js',
<% } %>
    paths.src + 'src/assets/images/**/*',
    paths.tmp + '/serve/*.html',
    paths.tmp + '/serve/{app,components}/**/*.html',
    paths.src + '/{app,components}/**/*.html'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([paths.tmp + '/serve', paths.src], null, []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(paths.dist, null, []);
});
