'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('markups', function() {
    function renameToHtml(path) {
      path.extname = '.html';
    }

    return gulp.src(options.src + '/{app,components}/**/*.<%= props.htmlPreprocessor.extension %>')
<% if (props.htmlPreprocessor.key === 'jade') { %>
      .pipe($.consolidate('jade', { basedir: options.src, doctype: 'html', pretty: '  ' })).on('error', options.errorHandler('Jade'))
<% } else if (props.htmlPreprocessor.key === 'haml') { %>
      .pipe($.consolidate('hamljs')).on('error', options.errorHandler('Haml'))
<% } else if (props.htmlPreprocessor.key === 'handlebars') { %>
      .pipe($.consolidate('handlebars')).on('error', options.errorHandler('Handlebars'))
<% } %>
      .pipe($.rename(renameToHtml))
      .pipe(gulp.dest(options.tmp + '/serve/'))
      .pipe(browserSync.reload({ stream: true }));
  });
};
