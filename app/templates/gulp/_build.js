'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var paths = gulp.paths;
<% if (props.cssPreprocessor.key !== 'none') { %>
gulp.task('styles', ['wiredep', 'injector:css:preprocessor'], function () {<% if (props.cssPreprocessor.key === 'less') { %>
  return gulp.src([paths.src + '/app/index.less', paths.src + '/app/vendor.less'])
    .pipe($.less({
      paths: [
        'bower_components',
        paths.src + '/app',
        paths.src + '/components'
      ]
    }))<% } else if (props.cssPreprocessor.key === 'ruby-sass') { %>
  return gulp.src([paths.src + '/app/index.scss', paths.src + '/app/vendor.scss'])
    .pipe($.rubySass({style: 'expanded'}))<% } else if (props.cssPreprocessor.key === 'node-sass') { %>
  return gulp.src([paths.src + '/app/index.scss', paths.src + '/app/vendor.scss'])
    .pipe($.sass({style: 'expanded'}))<% } else if (props.cssPreprocessor.key === 'stylus') { %>
  return gulp.src([paths.src + '/app/index.styl', paths.src + '/app/vendor.styl'])
    .pipe($.stylus())<% } %>
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.autoprefixer())
    .pipe(gulp.dest(paths.tmp + '/app/'));
});

gulp.task('injector:css:preprocessor', function () {<% if (props.cssPreprocessor.key === 'less') { %>
  return gulp.src(paths.src + '/app/index.less')
    .pipe($.inject(gulp.src([
        paths.src + '/{app,components}/**/*.less',
        '!' + paths.src + '/app/index.less',
        '!' + paths.src + '/app/vendor.less' <% } else if (props.cssPreprocessor.key === 'ruby-sass' || props.cssPreprocessor.key === 'node-sass') { %>
  return gulp.src(paths.src + '/app/index.scss')
    .pipe($.inject(gulp.src([
        paths.src + '/{app,components}/**/*.scss',
        '!' + paths.src + '/app/index.scss',
        '!' + paths.src + '/app/vendor.scss' <% } else if (props.cssPreprocessor.key === 'stylus') { %>
  return gulp.src(paths.src + '/app/index.styl')
    .pipe($.inject(gulp.src([
        paths.src + '/{app,components}/**/*.styl',
        '!' + paths.src + '/app/index.styl',
        '!' + paths.src + '/app/vendor.styl' <% } %>
      ], {read: false}), {
      transform: function(filePath) {
        filePath = filePath.replace(paths.src + '/app/', '');
        filePath = filePath.replace(paths.src + '/components/', '../components/');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    }))
    .pipe(gulp.dest(paths.src + '/app/'));
});
<% } %>
gulp.task('injector:css'<% if (props.cssPreprocessor.key !== 'none') { %>, ['styles']<% } else { %>, ['wiredep']<% } %>, function () {
  return gulp.src(paths.src + '/index.html')
    .pipe($.inject(gulp.src([<% if (props.cssPreprocessor.key !== 'none') { %>
        paths.tmp + '/{app,components}/**/*.css',
        '!' + paths.tmp + '/app/vendor.css'<% } else { %>
        paths.src + '/{app,components}/**/*.css'<% } %>
      ], {read: false}), {<% if (props.cssPreprocessor.key !== 'none') { %>
      ignorePath: paths.tmp,<% } else { %>
      ignorePath: paths.src,<% } %>
      addRootSlash: false
    }))
    .pipe(gulp.dest(paths.src + '/'));
});

gulp.task('scripts', function () {<% if (props.jsPreprocessor.extension === 'js') { %>
  return gulp.src(paths.src + '/{app,components}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))<% } if (props.jsPreprocessor.key === '6to5') { %>
    .pipe($['6to5']())<% } if (props.jsPreprocessor.key === 'traceur') { %>
    .pipe($.traceur())<% } if (props.jsPreprocessor.key === 'coffee') { %>
  return gulp.src(paths.src + '/{app,components}/**/*.coffee')
    .pipe($.coffeelint())
    .pipe($.coffeelint.reporter())
    .pipe($.coffee())<% } if (props.jsPreprocessor.key === 'typescript') { %>
  return gulp.src(paths.src + '/{app,components}/**/*.ts')
    .pipe($.typescript())<% } if (props.jsPreprocessor.key !== 'none') { %>
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })<% if (props.jsPreprocessor.srcExtension === 'es6') { %>
    .pipe(gulp.dest(paths.tmp + '/<%= props.jsPreprocessor.key %>'))<% } else if (props.jsPreprocessor.key !== 'none') { %>
    .pipe(gulp.dest(paths.tmp + '/'))<%} %>
    .pipe($.size())<% } %>;
});
<% if (props.jsPreprocessor.srcExtension === 'es6') { %>
gulp.task('browserify', ['scripts'], function () {
  return gulp.src(paths.tmp + '/<%= props.jsPreprocessor.key %>/app/index.js', { read: false })
    .pipe($.browserify())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest(paths.tmp + '/app'))
    .pipe($.size());
});

gulp.task('injector:js', ['browserify', 'injector:css'], function () {<% } else { %>
gulp.task('injector:js', ['scripts', 'injector:css'], function () {<% } %>
  return gulp.src([paths.src + '/index.html', paths.tmp + '/index.html'])
    .pipe($.inject(gulp.src([<% if (props.jsPreprocessor.key === 'none') { %>
      paths.src + '/{app,components}/**/*.js',<% } else if (props.jsPreprocessor.extension === 'js') { %>
      paths.tmp + '/{app,components}/**/*.js',<% } else { %>
      '{' + paths.src + ',' + paths.tmp + '}/{app,components}/**/*.js',<% } %>
      '!' + paths.src + '/{app,components}/**/*.spec.js',
      '!' + paths.src + '/{app,components}/**/*.mock.js'<% if (props.jsPreprocessor.key === 'none') { %>
    ]).pipe($.angularFilesort()), {
      ignorePath: paths.src,<% } else if (props.jsPreprocessor.srcExtension === 'es6') { %>
    ]), {
      ignorePath: paths.tmp,<% } else { %>
    ]).pipe($.angularFilesort()), {
      ignorePath: [paths.src, paths.tmp],<% } %>
      addRootSlash: false
    }))
    .pipe(gulp.dest(paths.src + '/'));
});

gulp.task('partials', <% if (!_.isEmpty(props.htmlPreprocessors)) { %>['consolidate'], <% } %>function () {
  return gulp.src([paths.src + '/{app,components}/**/*.html', paths.tmp + '/{app,components}/**/*.html'])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: '<%= appName %>'
    }))
    .pipe(gulp.dest(paths.tmp + '/inject/'));
});

gulp.task('html', ['wiredep', 'injector:css', 'injector:js', 'partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src([paths.src + '/*.html', paths.tmp + '/*.html'])
    .pipe($.inject(gulp.src(paths.tmp + '/inject/templateCacheHtml.js', {read: false}), {
      starttag: '<!-- inject:partials -->',
      ignorePath: paths.tmp,
      addRootSlash: false
    }))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)<% if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'scss') { %>
    .pipe($.replace('<%= computedPaths.appToBower %>/bower_components/bootstrap-sass-official/assets/fonts/bootstrap','../fonts'))<% } else if (props.ui.key === 'bootstrap' && props.cssPreprocessor.extension === 'less') { %>
    .pipe($.replace('<%= computedPaths.appToBower %>/bower_components/bootstrap/fonts','../fonts'))<% } %>
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
  return gulp.src(paths.src + '/assets/images/**/*')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(paths.dist + '/assets/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'misc']);
