'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('styles', function () {
<% if (props.cssPreprocessor.key === 'less') { %>
    var lessOptions = {
      options: [
        'bower_components',
        options.src + '/app',
        options.src + '/components'
      ]
    };
<% } if (props.cssPreprocessor.extension === 'scss') { %>
    var sassOptions = {
      style: 'expanded'
    };
<% } %>

    var injectFiles = gulp.src([
      options.src + '/{app,components}/**/*.<%= props.cssPreprocessor.extension %>',
      '!' + options.src + '/app/index.<%= props.cssPreprocessor.extension %>',
      '!' + options.src + '/app/vendor.<%= props.cssPreprocessor.extension %>'
    ], { read: false });

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.src + '/app/', '');
        filePath = filePath.replace(options.src + '/components/', '../components/');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    var indexFilter = $.filter('index.<%= props.cssPreprocessor.extension %>');

    return gulp.src([
      options.src + '/app/index.<%= props.cssPreprocessor.extension %>',
      options.src + '/app/vendor.<%= props.cssPreprocessor.extension %>'
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

    .pipe($.autoprefixer())
      .on('error', function handleError(err) {
        console.error(err.toString());
        this.emit('end');
      })
      .pipe(gulp.dest(options.tmp + '/serve/app/'));
  });
};
