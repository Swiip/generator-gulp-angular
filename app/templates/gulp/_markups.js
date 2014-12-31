'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var engines = [
  <%= consolidateParameters.join(',\n  ') %>
];

function buildTemplates(engine, src, dest) {
  return gulp.src(src)
    .pipe($.consolidate.apply(this, engine))
    .pipe($.rename(function (path) {path.extname = '.html';}))
    .pipe(gulp.dest(dest));
}

function buildTaskFunction(engine) {
  return function() {
    buildTemplates(engine, paths.src + '/app/**/*.jade', '.tmp/serve/app/');
    buildTemplates(engine, paths.src + '/components/**/*.jade', '.tmp/serve/components/');
  };
}

var tasks = [];

for (var i=0, l=engines.length; i < l; i++) {
  var engine = engines[i];

  gulp.task('consolidate:' + engine[0] + ':app', buildTemplates.bind(this, engine, paths.src + '/app/**/*.jade', paths.tmp + '/serve/app/'));
  gulp.task('consolidate:' + engine[0] + ':components', buildTemplates.bind(this, engine, paths.src + '/components/**/*.jade', paths.tmp + '/serve/components/'));
  gulp.task('consolidate:' + engine[0], ['consolidate:' + engine[0] + ':app', 'consolidate:' + engine[0] + ':components' ]);

  tasks.push('consolidate:' + engine[0]);
}

gulp.task('markups', tasks);
