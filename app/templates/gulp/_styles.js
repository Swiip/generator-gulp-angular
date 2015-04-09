'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

module.exports = function(options) {
  gulp.task('styles', function () {
<% if (props.cssPreprocessor.key === 'less') { %>
    var lessOptions = {
      options: [
        'bower_components',
        options.src + '/app'
      ]
    };
<% } if (props.cssPreprocessor.extension === 'scss') { %>
    var sassOptions = {
      style: 'expanded'
    };
<% } %>

    var injectFiles = gulp.src([
      options.src + '/app/**/*.<%= props.cssPreprocessor.extension %>',
      '!' + options.src + '/app/index.<%= props.cssPreprocessor.extension %>',
      '!' + options.src + '/app/vendor.<%= props.cssPreprocessor.extension %>'
    ], { read: false });

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.src + '/app/', '');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    var indexFilter = $.filter('index.<%= props.cssPreprocessor.extension %>');
    var vendorFilter = $.filter('vendor.<%= props.cssPreprocessor.extension %>');
<% if (props.cssPreprocessor.key === 'ruby-sass') { %>
    var cssFilter = $.filter('**/*.css');
<% } %>

    return gulp.src([
      options.src + '/app/index.<%= props.cssPreprocessor.extension %>',
      options.src + '/app/vendor.<%= props.cssPreprocessor.extension %>'
    ])
      .pipe(indexFilter)
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(indexFilter.restore())
      .pipe(vendorFilter)
      .pipe(wiredep(_.extend({}, options.wiredep)))
      .pipe(vendorFilter.restore())
<% if (props.cssPreprocessor.key === 'ruby-sass') { %>
      .pipe($.rubySass(sassOptions)).on('error', options.errorHandler('RubySass'))
      .pipe(cssFilter)
      .pipe($.sourcemaps.init({ loadMaps: true }))
<% } else { %>
      .pipe($.sourcemaps.init())
<% } if (props.cssPreprocessor.key === 'less') { %>
      .pipe($.less(lessOptions)).on('error', options.errorHandler('Less'))
<% } else if (props.cssPreprocessor.key === 'node-sass') { %>
      .pipe($.sass(sassOptions)).on('error', options.errorHandler('Sass'))
<% } else if (props.cssPreprocessor.key === 'stylus') { %>
      .pipe($.stylus()).on('error', options.errorHandler('Stylus'))
<% } %>
      .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
<% if (props.cssPreprocessor.key === 'ruby-sass') { %>
      .pipe(cssFilter.restore())
<% } %>
      .pipe(gulp.dest(options.tmp + '/serve/app/'))
      .pipe(browserSync.reload({ stream: true }));
  });
};
