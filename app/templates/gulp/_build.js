'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

<% if (props.htmlPreprocessor.key === 'none') { -%>
gulp.task('partials', function () {
<% } else { -%>
gulp.task('partials', ['markups'], function () {
<% } -%>
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: '<%- appName %>',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.sourcemaps.init())
<% if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'scss') { -%>
    .pipe($.replace('../<%- computedPaths.appToBower %>/bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))
<% } else if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'less') { -%>
    .pipe($.replace('../<%- computedPaths.appToBower %>/bower_components/bootstrap/fonts/', '../fonts/'))
<% } else if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'styl') { -%>
    .pipe($.replace('../<%- computedPaths.appToBower %>/bower_components/bootstrap-stylus/fonts/', '../fonts/'))
<% } -%>
    .pipe($.minifyCss({ processImport: false }))
    .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });
<% if (imageMin) { -%>

gulp.task('images', function () {
  return gulp.src(path.join(conf.paths.src, '/assets/images/**/*'))
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/images/')));
});
<% } -%>

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
<% if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'styl') { -%>
  return gulp.src($.mainBowerFiles().concat('bower_components/bootstrap-stylus/fonts/*'))
<% } else { -%>
  return gulp.src($.mainBowerFiles())
<% } -%>
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{<%- processedFileExtension %>}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

<% if (props.jsPreprocessor.key === 'typescript') { -%>
gulp.task('clean', ['tsd:purge'], function (done) {
<% } else { -%>
gulp.task('clean', function (done) {
<% } -%>
  $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

<% if (imageMin) { -%>
gulp.task('build', ['html', 'images', 'fonts', 'other']);
<% } else { -%>
gulp.task('build', ['html', 'fonts', 'other']);
<% } -%>
