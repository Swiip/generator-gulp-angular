'use strict';

var gulp = require('gulp');
var fs = require('fs');
var argv = require('yargs').argv;
var $ = require('gulp-load-plugins')();

//var ngConstant = require('gulp-ng-constant');

var environment = argv.env || 'default';
//var ENV = JSON.parse(fs.readFileSync('./src/app/env_configs/config-' + environment + '.json', 'utf8')).ENV;

gulp.task('env-config', function () {
 return gulp.src('src/app/env_configs/config-' + environment + '.json')
    .pipe($.ngConstant({
      name: '<%- appName %>',
      deps: false,
      dest: 'constants.config.js'
    }))
    .pipe(gulp.dest('src/app'));
});