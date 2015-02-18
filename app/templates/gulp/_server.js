'use strict';

var gulp = require('gulp');

var util = require('util');

var browserSync = require('browser-sync');

var spa = require('browser-sync-spa');

var middleware = require('./proxy');

module.exports = function(options) {
<% if(qrCode) { %>

  var qrcode = require('qrcode-terminal');
<% } %>

  function browserSyncInit(baseDir, files, browser) {
    browser = browser === undefined ? 'default' : browser;

    files = files ? files : [];

    var routes = null;
    if(baseDir === options.src || (util.isArray(baseDir) && baseDir.indexOf(options.src) !== -1)) {
      routes = {
        '/bower_components': 'bower_components'
      };
    }

    var server = {
      baseDir: baseDir,
      routes: routes
    };

    if(middleware.length > 0) {
      server.middleware = middleware;
    }

    browserSync.instance = browserSync.init(files, {
      startPath: '/',
      server: server,
      browser: browser
<% if(qrCode) { %>
    }, function(err, bs) {
      qrcode.generate(bs.options.urls.external);
    });
<% } else { %>
    });
<% } %>
  }

  browserSync.use(spa({
    selector: '[ng-app]'// Only needed for angular apps
  }));


gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    options.tmp + '/serve',
    options.src
  ], [
<% if(props.cssPreprocessor.key === 'none') { %>
    options.src + '/{app,components}/**/*.css',
<% } else { %>
    options.tmp + '/serve/{app,components}/**/*.css',
<% } if(props.jsPreprocessor.key === 'none') { %>
    options.src + '/{app,components}/**/*.js',
<% } else { %>
    options.tmp + '/serve/{app,components}/**/*.js',
<% } %>
    options.src + '/assets/images/**/*',
    options.tmp + '/serve/*.html',
    options.tmp + '/serve/{app,components}/**/*.html',
    options.src + '/{app,components}/**/*.html'
  ]);
});

  gulp.task('serve:dist', ['build'], function () {
    browserSyncInit(options.dist);
  });

  gulp.task('serve:e2e', ['inject'], function () {
    browserSyncInit([options.tmp + '/serve', options.src], null, []);
  });

  gulp.task('serve:e2e-dist', ['build'], function () {
    browserSyncInit(options.dist, null, []);
  });
};
