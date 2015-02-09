'use strict';

var gulp = require('gulp');
var merge = require('merge-stream');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function(options) {
  <% if (props.htmlPreprocessor.key === 'none') { %>
  gulp.task('partials', function () {
  <% } else { %>
  gulp.task('partials', ['markups'], function () {
  <% } %>
    return gulp.src([
      options.src + '/{app,components}/**/*.html',
      options.tmp + '/serve/{app,components}/**/*.html'
    ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: '<%= appName %>'
      }))
      .pipe(gulp.dest(options.tmp + '/partials/'));
  });

  gulp.task('html', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', { read: false });
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: options.tmp + '/partials',
      addRootSlash: false
    };

    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(options.tmp + '/serve/*.html')
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe(assets = $.useref.assets())
      .pipe($.rev())
      .pipe(jsFilter)
      .pipe($.ngAnnotate())
      .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
  <% if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'scss') { %>
      .pipe($.replace('/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/', '../fonts/'))
  <% } else if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'less') { %>
      .pipe($.replace('/bower_components/bootstrap/fonts/', '../fonts/'))
  <% } %>
      .pipe($.csso())
      .pipe(cssFilter.restore())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(htmlFilter)
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe(htmlFilter.restore())
      .pipe(gulp.dest(options.dist + '/'))
      .pipe($.size({ title: options.dist + '/', showFiles: true }));
  });

  gulp.task('images', function () {
    return gulp.src(options.src + '/assets/images/**/*')<% if (imageMin) { %>
      .pipe($.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      }))<% } %>
      .pipe(gulp.dest(options.dist + '/assets/images/'));
  });

  gulp.task('fonts', function () {
    var customFonts = gulp.src(options.src + '/assets/fonts/**/*')
      .pipe(gulp.dest(options.dist + '/assets/fonts/'));

    var bowerFonts = gulp.src($.mainBowerFiles())
      .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
      .pipe($.flatten())
      .pipe(gulp.dest(options.dist + '/fonts/'));

    return merge(customFonts, bowerFonts);
  });

  gulp.task('misc', function () {
    return gulp.src(options.src + '/**/*.ico')
      .pipe(gulp.dest(options.dist + '/'));
  });

  gulp.task('clean'
  <% if (props.jsPreprocessor.key === 'typescript') { %>, ['tsd:purge']
  <% } %>, function (done) {
    $.del([options.dist + '/', options.tmp + '/'], done);
  });

  gulp.task('build', ['html', 'images', 'fonts', 'misc']);
};
