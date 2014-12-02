'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var config = require('require-dir')('./config');

<% if (props.cssPreprocessor.key !== 'css') { %>
gulp.task('styles', ['wiredep'], function () {<% if (props.cssPreprocessor.key === 'less') { %>
  return gulp.src(paths.app + '{app,components}/**/*.less')
    .pipe($.less({
      paths: [
        config.paths.app + '/bower_components',
        config.paths.app + '/app',
        config.paths.app + '/components'
      ]
    }))<% } else if (props.cssPreprocessor.key === 'ruby-sass') { %>
  return gulp.src(config.paths.app + '/{app,components}/**/*.scss')
    .pipe($.rubySass({style: 'expanded'}))<% } else if (props.cssPreprocessor.key === 'node-sass') { %>
  return gulp.src(config.paths.app + '/{app,components}/**/*.scss')
    .pipe($.sass({style: 'expanded'}))<% } else if (props.cssPreprocessor.key === 'stylus') { %>
  return gulp.src(config.paths.app + '/{app,components}/**/*.styl')
    .pipe($.stylus())<% } %>
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/'))
    .pipe($.size());
});
<% } %>
gulp.task('scripts', function () {
  return gulp.src(config.paths.app + '/{app,components}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

gulp.task('partials', function () {
  return gulp.src(config.paths.app + '/{app,components}/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: '<%= appName %>'
    }))
    .pipe(gulp.dest('.tmp/inject/'))
    .pipe($.size());
});

gulp.task('html', [<% if (props.cssPreprocessor.key !== 'css') { %>'styles', <% } else { %>'wiredep', <% } %>'scripts', 'partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(config.paths.app + '/*.html')
    .pipe($.inject(gulp.src('.tmp/inject/templateCacheHtml.js', {read: false}), {
      starttag: '<!-- inject:partials -->',
      ignorePath: '.tmp',
      addRootSlash: false
    }))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)<% if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'scss') { %>
    .pipe($.replace('bower_components/bootstrap-sass-official/assets/fonts/bootstrap','fonts'))<% } else if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'less') { %>
    .pipe($.replace('bower_components/bootstrap/fonts','fonts'))<% } %>
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
    .pipe(gulp.dest('dist/'))
    .pipe($.size());
});

gulp.task('images', function () {
  return gulp.src(config.paths.app + '/assets/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images/'))
    .pipe($.size());
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts/'))
    .pipe($.size());
});

gulp.task('misc', function () {
  return gulp.src(config.paths.app + '/**/*.ico')
    .pipe(gulp.dest('dist/'))
    .pipe($.size());
});

gulp.task('clean', function (done) {
  $.del(['dist/', '.tmp/'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc']);
