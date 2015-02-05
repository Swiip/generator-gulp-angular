'use strict';

var gulp = require('gulp');
var merge = require('merge-stream');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

<% if (props.htmlPreprocessor.key === 'none') { %>
gulp.task('partials', function () {
<% } else { %>
gulp.task('partials', ['markups'], function () {
<% } %>
  return gulp.src([
    paths.src + '/{app,components}/**/*.html',
    paths.tmp + '/serve/{app,components}/**/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: '<%= appName %>'
    }))
    .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(paths.tmp + '/serve/*.html')
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
    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src(paths.src + '/assets/images/**/*')<% if (imageMin) { %>
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))<% } %>
    .pipe(gulp.dest(paths.dist + '/assets/images/'));
});

gulp.task('fonts:tmp', function() {
  return gulp.src($.mainBowerFiles(), {base: 'bower_components'})
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.rename(function(path) {
      var fontsIndex = path.dirname.indexOf('fonts');
      if (fontsIndex > 0) {
        // Keep folder structure from fonts directory
        path.dirname = path.dirname.substring(fontsIndex + 5);
        path.dirname  = (path.dirname.length && path.dirname [0] === '/') ? path.dirname .slice(1) : path.dirname;
      } else {
        path.dirname = '';
      }
    }))
    .pipe(gulp.dest(paths.tmp + '/serve/fonts/'));
});

gulp.task('fonts', ['fonts:tmp'], function () {
  var srcFonts = gulp.src(paths.src + '/assets/fonts/**/*')
    .pipe(gulp.dest(paths.dist + '/assets/fonts/'));

  var tmpFonts = gulp.src(paths.tmp + '/serve/fonts/**/*')
    .pipe(gulp.dest(paths.dist + '/fonts/'));

  return merge(srcFonts, tmpFonts);
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean'
<% if (props.jsPreprocessor.key === 'typescript') { %>, ['tsd:purge']
<% } %>, function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc']);
