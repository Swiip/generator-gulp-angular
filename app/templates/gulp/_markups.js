'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

gulp.task('markups', function() {
  function renameToHtml(path) {
    path.extname = '.html';
  }

  return gulp.src(paths.src + '/{app,components}/**/*.<%= props.htmlPreprocessor.extension %>')
<% if (props.htmlPreprocessor.key === 'jade') { %>
    .pipe($.consolidate('jade', { pretty: '  ' }))
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
    .pipe(gulp.dest(paths.tmp + '/serve/'));
});
