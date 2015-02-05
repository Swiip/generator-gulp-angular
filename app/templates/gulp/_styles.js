'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {

<% if (props.cssPreprocessor.key === 'less') { %>
  var lessOptions = {
    paths: [
      'bower_components',
      paths.src + '/app',
      paths.src + '/components'
    ]
  };
<% } %>
<% if (props.cssPreprocessor.extension === 'scss') { %>
  var sassOptions = {
    style: 'expanded'
  };
<% } %>

  var injectFiles = gulp.src([
    paths.src + '/{app,components}/**/*.<%= props.cssPreprocessor.extension %>',
    '!' + paths.src + '/app/index.<%= props.cssPreprocessor.extension %>',
    '!' + paths.src + '/app/vendor.<%= props.cssPreprocessor.extension %>'
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(paths.src + '/app/', '');
      filePath = filePath.replace(paths.src + '/components/', '../components/');
      return '@import \'' + filePath + '\';';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  var indexFilter = $.filter('index.<%= props.cssPreprocessor.extension %>');

  return gulp.src([
    paths.src + '/app/index.<%= props.cssPreprocessor.extension %>',
    paths.src + '/app/vendor.<%= props.cssPreprocessor.extension %>'
  ])
    .pipe(indexFilter)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(indexFilter.restore())
<% if (props.cssPreprocessor.key === 'less') { %>
    .pipe($.less(lessOptions))
<% } else if (props.cssPreprocessor.key === 'ruby-sass') { %>
    .pipe($.rubySass(sassOptions))
<% } else if (props.cssPreprocessor.key === 'node-sass') { %>
    .pipe($.sass(sassOptions))
<% } else if (props.cssPreprocessor.key === 'stylus') { %>
    .pipe($.stylus())
<% } %>
  .pipe($.ignore.exclude('*.map'))
  .pipe($.autoprefixer())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest(paths.tmp + '/serve/app/'));
});
