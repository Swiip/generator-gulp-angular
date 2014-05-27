'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');

/* This configuration allow you to configure browser sync to proxy your backend */
var proxyTarget = 'http://server/context/'; // The location of your backend
var proxyApiPrefix = 'api'; // The element in the URL which differentiate between API request and static file request

var proxy = httpProxy.createProxyServer({
  target: proxyTarget
});

function proxyMiddleware(req, res, next) {
  if (req.url.indexOf(proxyApiPrefix) != -1) {
    proxy.web(req, res);
  } else {
    next();
  }
};

function browserSyncInit(baseDir, files) {
  browserSync.init(files, {
    startPath: "/index.html",
    server: {
      baseDir: baseDir,
      middleware: proxyMiddleware
    }
  });
}

gulp.task('serve', ['watch'], function() {
  browserSyncInit([
    'app',
    '.tmp'
  ], [
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/partials/**/*.html',
    'app/images/**/*'
  ]);
});

gulp.task('serve:dist', ['build'], function() {
  browserSyncInit('dist');
});
