'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

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
    .pipe($.less(lessOptions)).on('error', options.errorHandler('Less'))
<% } else if (props.cssPreprocessor.key === 'ruby-sass') { %>
    .pipe($.rubySass(sassOptions)).on('error', options.errorHandler('RubySass'))
<% } else if (props.cssPreprocessor.key === 'node-sass') { %>
    .pipe($.sass(sassOptions)).on('error', options.errorHandler('Sass'))
<% } else if (props.cssPreprocessor.key === 'stylus') { %>
    .pipe($.stylus()).on('error', options.errorHandler('Stylus'))
<% } %>
    .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
    .pipe(gulp.dest(options.tmp + '/serve/app/'))
    .pipe(browserSync.reload({ stream: true }));
  });
};
