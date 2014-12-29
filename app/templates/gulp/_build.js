'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

<% if (props.cssPreprocessor.key !== 'none') { %>
gulp.task('styles', ['wiredep', 'injector:css:preprocessor'], function () {
<% if (props.cssPreprocessor.key === 'less') { %>
  return gulp.src(['src/app/index.less', 'src/app/vendor.less'])
    .pipe($.less({
      paths: [
        'bower_components',
        'src/app',
        'src/components'
      ]
    }))
<% } else if (props.cssPreprocessor.key === 'ruby-sass') { %>
  return gulp.src(['src/app/index.scss', 'src/app/vendor.scss'])
    .pipe($.rubySass({style: 'expanded'}))
<% } else if (props.cssPreprocessor.key === 'node-sass') { %>
  return gulp.src(['src/app/index.scss', 'src/app/vendor.scss'])
    .pipe($.sass({style: 'expanded'}))
<% } else if (props.cssPreprocessor.key === 'stylus') { %>
  return gulp.src(['src/app/index.styl', 'src/app/vendor.styl'])
    .pipe($.stylus())
<% } %>
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.autoprefixer())
    .pipe(gulp.dest('.tmp/app/'));
});

gulp.task('injector:css:preprocessor', function () {
<% if (props.cssPreprocessor.key === 'less') { %>
  return gulp.src('src/app/index.less')
    .pipe($.inject(gulp.src([
        'src/{app,components}/**/*.less',
        '!src/app/index.less',
        '!src/app/vendor.less'
<% } else if (props.cssPreprocessor.key === 'ruby-sass' || props.cssPreprocessor.key === 'node-sass') { %>
  return gulp.src('src/app/index.scss')
    .pipe($.inject(gulp.src([
        'src/{app,components}/**/*.scss',
        '!src/app/index.scss',
        '!src/app/vendor.scss'
<% } else if (props.cssPreprocessor.key === 'stylus') { %>
  return gulp.src('src/app/index.styl')
    .pipe($.inject(gulp.src([
        'src/{app,components}/**/*.styl',
        '!src/app/index.styl',
        '!src/app/vendor.styl'
<% } %>
      ], { read: false }), {
      transform: function(filePath) {
        filePath = filePath.replace('src/app/', '');
        filePath = filePath.replace('src/components/', '../components/');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    }))
    .pipe(gulp.dest('src/app/'));
});
<% } %>

<% if (props.cssPreprocessor.key !== 'none') { %>
gulp.task('injector:css', ['styles'], function () {
<% } else { %>
gulp.task('injector:css', ['wiredep'], function () {
<% } %>
  return gulp.src('src/index.html')
    .pipe($.inject(gulp.src([
<% if (props.cssPreprocessor.key !== 'none') { %>
        '.tmp/{app,components}/**/*.css',
        '!.tmp/app/vendor.css'
<% } else { %>
        'src/{app,components}/**/*.css'
<% } %>
      ], {read: false}), {
<% if (props.cssPreprocessor.key !== 'none') { %>
      ignorePath: '.tmp',
<% } else { %>
      ignorePath: 'src',
<% } %>
      addRootSlash: false
    }))
    .pipe(gulp.dest('src/'));
});

gulp.task('scripts', function () {
<% if (props.jsPreprocessor.extension === 'js') { %>
  return gulp.src('src/{app,components}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
<% } if (props.jsPreprocessor.key === '6to5') { %>
    .pipe($['6to5']())
<% } if (props.jsPreprocessor.key === 'traceur') { %>
    .pipe($.traceur())
<% } if (props.jsPreprocessor.key === 'coffee') { %>
  return gulp.src('src/{app,components}/**/*.coffee')
    .pipe($.coffeelint())
    .pipe($.coffeelint.reporter())
    .pipe($.coffee())
<% } if (props.jsPreprocessor.key === 'typescript') { %>
  return gulp.src('src/{app,components}/**/*.ts')
    .pipe($.typescript())
<% } if (props.jsPreprocessor.key !== 'none') { %>
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
<%   if (props.jsPreprocessor.srcExtension === 'es6') { %>
    .pipe(gulp.dest('.tmp/<%= props.jsPreprocessor.key %>'))
<%   } else if (props.jsPreprocessor.key !== 'none') { %>
    .pipe(gulp.dest('.tmp/'))
<%   } %>
    .pipe($.size())
<% } %>;
});

<% if (props.jsPreprocessor.srcExtension === 'es6') { %>
gulp.task('browserify', ['scripts'], function () {
  return gulp.src('.tmp/<%= props.jsPreprocessor.key %>/app/index.js', { read: false })
    .pipe($.browserify())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('.tmp/app'))
    .pipe($.size());
});

gulp.task('injector:js', ['browserify', 'injector:css'], function () {
<% } else { %>
gulp.task('injector:js', ['scripts', 'injector:css'], function () {
<% } %>
  return gulp.src(['src/index.html', '.tmp/index.html'])
    .pipe($.inject(gulp.src([
<% if (props.jsPreprocessor.key === 'none') { %>
      'src/{app,components}/**/*.js',
<% } else if (props.jsPreprocessor.extension === 'js') { %>
      '.tmp/{app,components}/**/*.js',
<% } else { %>
      '{src,.tmp}/{app,components}/**/*.js',
<% } %>
      '!src/{app,components}/**/*.spec.js',
      '!src/{app,components}/**/*.mock.js'
<% if (props.jsPreprocessor.key === 'none') { %>
    ]).pipe($.angularFilesort()), {
      ignorePath: 'src',
<% } else if (props.jsPreprocessor.srcExtension === 'es6') { %>
    ]), {
      ignorePath: '.tmp',
<% } else { %>
    ]).pipe($.angularFilesort()), {
      ignorePath: ['src', '.tmp'],
<% } %>
      addRootSlash: false
    }))
    .pipe(gulp.dest('src/'));
});

<% if (!_.isEmpty(props.htmlPreprocessors)) { %>
gulp.task('partials', ['consolidate'], function () {
<% } else { %>
gulp.task('partials', function () {
<% } %>
  return gulp.src(['src/{app,components}/**/*.html', '.tmp/{app,components}/**/*.html'])
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

  return gulp.src(['src/*.html', '.tmp/*.html'])
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
    .pipe(cssFilter)
<% if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'scss') { %>
    .pipe($.replace('bower_components/bootstrap-sass-official/assets/fonts/bootstrap','fonts'))
<% } else if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'less') { %>
    .pipe($.replace('bower_components/bootstrap/fonts','fonts'))
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
    .pipe(gulp.dest('dist/'))
    .pipe($.size({ title: 'dist/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src('src/assets/images/**/*')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/assets/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src('src/**/*.ico')
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function (done) {
  $.del(['dist/', '.tmp/'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc']);
