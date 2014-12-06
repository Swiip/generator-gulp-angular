'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var config = require('require-dir')('./config');

<% if (props.cssPreprocessor.key !== 'css') { %>
gulp.task('styles', ['wiredep', 'injector:css:preprocessor'], function () {<% if (props.cssPreprocessor.key === 'less') { %>
  return gulp.src([config.paths.app + '/app/index.less', config.paths.app + '/app/vendor.less'])
    .pipe($.less({
      paths: [
        config.paths.app + '/bower_components',
        config.paths.app + '/app',
        config.paths.app + '/components'
      ]
    }))<% } else if (props.cssPreprocessor.key === 'ruby-sass') { %>
  return gulp.src([config.paths.app + '/app/index.scss', config.paths.app + '/app/vendor.scss'])
    .pipe($.rubySass({style: 'expanded'}))<% } else if (props.cssPreprocessor.key === 'node-sass') { %>
  return gulp.src([config.paths.app + '/app/index.scss', config.paths.app + '/app/vendor.scss'])
    .pipe($.sass({style: 'expanded'}))<% } else if (props.cssPreprocessor.key === 'stylus') { %>
  return gulp.src([config.paths.app + '/app/index.styl', config.paths.app + '/app/vendor.styl'])
    .pipe($.stylus())<% } %>
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/app/'));
});

gulp.task('injector:css:preprocessor', function () {<% if (props.cssPreprocessor.key === 'less') { %>
  return gulp.src(config.paths.app + '/app/index.less')
    .pipe($.inject(gulp.src([
        config.paths.app + '/{app,components}/**/*.less',
        '!' + config.paths.app + '/app/index.less',
        '!' + config.paths.app + '/app/vendor.less' <% } else if (props.cssPreprocessor.key === 'ruby-sass' || props.cssPreprocessor.key === 'node-sass') { %>
  return gulp.src(config.paths.app + '/app/index.scss')
    .pipe($.inject(gulp.src([
        config.paths.app + '/{app,components}/**/*.scss',
        '!' + config.paths.app + '/app/index.scss',
        '!' + config.paths.app + '/app/vendor.scss' <% } else if (props.cssPreprocessor.key === 'stylus') { %>
  return gulp.src(config.paths.app + '/app/index.styl')
    .pipe($.inject(gulp.src([
        config.paths.app + '/{app,components}/**/*.styl',
        '!' + config.paths.app + '/app/index.styl',
        '!' + config.paths.app + '/app/vendor.styl' <% } %>
      ], {read: false}), {
      transform: function(filePath) {
        filePath = filePath.replace(config.paths.app + '/app/', '');
        filePath = filePath.replace(config.paths.app + '/components/', '../components/');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    }))
    .pipe(gulp.dest(config.paths.app + '/app/'));
});
<% } %>
gulp.task('injector:css'<% if (props.cssPreprocessor.key !== 'css') { %>, ['styles']<% } else { %>, ['wiredep']<% } %>, function () {
  return gulp.src(config.paths.app + '/index.html')
    .pipe($.inject(gulp.src([<% if (props.cssPreprocessor.key !== 'css') { %>
        '.tmp/{app,components}/**/*.css',
        '!.tmp/app/vendor.css'<% } else { %>
        config.paths.app + '/{app,components}/**/*.css'<% } %>
      ], {read: false}), {<% if (props.cssPreprocessor.key !== 'css') { %>
      ignorePath: '.tmp',<% } else { %>
      ignorePath: 'src',<% } %>
      addRootSlash: false
    }))
    .pipe(gulp.dest(config.paths.app + '/'));
});

gulp.task('jshint', function () {
  return gulp.src(config.paths.app + '/{app,components}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('injector:js', ['jshint', 'injector:css'], function () {
  return gulp.src(config.paths.app + '/index.html')
    .pipe($.inject(gulp.src([
        config.paths.app + '/{app,components}/**/*.js',
        '!' + config.paths.app + '/{app,components}/**/*.spec.js',
        '!' + config.paths.app + '/{app,components}/**/*.mock.js'
      ], {read: false}), {
      ignorePath: config.paths.app,
      addRootSlash: false
    }))
    .pipe(gulp.dest(config.paths.app + '/'));
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
    .pipe(gulp.dest('.tmp/inject/'));
});

gulp.task('html', ['wiredep', 'injector:css', 'injector:js', 'partials'], function () {
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
    .pipe($.size({ title: 'dist/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src(config.paths.app + '/assets/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src(config.paths.app + '/**/*.ico')
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function (done) {
  $.del(['dist/', '.tmp/'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc']);
