'use strict';

var consolidate = require('gulp-consolidate');
var rename = require('gulp-rename');
var gulp = require('gulp');
var paths = gulp.paths;

var engines = [
  <%= consolidateParameters.join(',\n  ') %>
];

function buildTemplates(engine, src, dest) {
  return gulp.src(src)
    .pipe(consolidate.apply(this, engine))
    .pipe(rename(function (path) {path.extname = '.html';}))
    .pipe(gulp.dest(dest));
}

function buildTaskFunction(engine) {
  return function() {
    buildTemplates(engine, paths.src + '/app/**/*.jade', paths.tmp + '/app/');
    buildTemplates(engine, paths.src + '/components/**/*.jade', paths.tmp + '/components/');
  };
}

var tasks = [];

for (var i=0, l=engines.length; i < l; i++) {
  var engine = engines[i];

  gulp.task('consolidate:' + engine[0] + ':app', buildTemplates.bind(this, engine, paths.src + '/app/**/*.jade', paths.tmp + '/app/'));
  gulp.task('consolidate:' + engine[0] + ':components', buildTemplates.bind(this, engine, paths.src + '/components/**/*.jade', paths.tmp + '/components/'));
  gulp.task('consolidate:' + engine[0], ['consolidate:' + engine[0] + ':app', 'consolidate:' + engine[0] + ':components' ]);

  tasks.push('consolidate:' + engine[0]);
}

gulp.task('consolidate', tasks);
