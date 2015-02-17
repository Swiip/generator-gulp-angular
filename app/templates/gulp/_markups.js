'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('markups', function() {
    function renameToHtml(path) {
      path.extname = '.html';
    }

    return gulp.src(options.src + '/{app,components}/**/*.<%= props.htmlPreprocessor.extension %>')
<% if (props.htmlPreprocessor.key === 'jade') { %>
      .pipe($.consolidate('jade', { basedir: options.src, doctype: 'html', pretty: '  ' }))
<% } else if (props.htmlPreprocessor.key === 'haml') { %>
      .pipe($.consolidate('hamljs'))
<% } else if (props.htmlPreprocessor.key === 'handlebars') { %>
      .pipe($.consolidate('handlebars'))
<% } %>
      .on('error', function handleError(err) {
        console.error(err.toString());
        this.emit('end');
      })
      .pipe($.rename(renameToHtml))
      .pipe(gulp.dest(options.tmp + '/serve/'));
  });
};
