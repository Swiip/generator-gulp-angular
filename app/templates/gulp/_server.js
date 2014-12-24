'use strict';

var gulp = require('gulp');

var util = require('util');

var browserSync = require('browser-sync');

var qrcode = require('qrcode-terminal');

var middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === 'src' || (util.isArray(baseDir) && baseDir.indexOf('src') !== -1)) {
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
  }, function(err, bs){
    qrcode.generate(bs.options.urls.external);
  });

}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    '.tmp',
    'src'
  ], [
    '<% if(props.cssPreprocessor.key === 'none') { %>src<% } else { %>.tmp<% } %>/{app,components}/**/*.css',
    '<% if(props.jsPreprocessor.key === 'none') { %>src<% } else { %>.tmp<% } %>/{app,components}/**/*.js',
    'src/assets/images/**/*',
    '.tmp/*.html',
    '.tmp/{app,components}/**/*.html',
    'src/*.html',
    'src/{app,components}/**/*.html'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit('dist');
});

gulp.task('serve:e2e', ['wiredep', 'injector:js', 'injector:css'], function () {
  browserSyncInit(['.tmp', 'src'], null, []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit('dist', null, []);
});
