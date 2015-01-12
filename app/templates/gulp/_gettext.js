'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var paths = gulp.paths;

gulp.task('gettext:extract', function () {
  return gulp.src([
  // Esprima fails to parse ES6 import from statement.
  // Waiting https://github.com/rubenv/angular-gettext-tools/pull/73 to be merged and released.
<% if (props.jsPreprocessor.extension !== 'js' || props.jsPreprocessor.srcExtension === 'es6') { %>
    paths.src + '/*.html', paths.src + '/{app,components}/**/*.html',
<% } else { %>
    paths.src + '/*.{html,js}', paths.src + '/{app,components}/**/*.{html,js}',
<% } %>
    paths.tmp + '/serve/*.{html,js}', paths.tmp + '/serve/{app,components}/**/*.{html,js}'
  ], {base: '.'})
    .pipe($.angularGettext.extract('template.pot'))
    .pipe(gulp.dest(paths.src + '/app/gettext'));
});

gulp.task('gettext:compile', function () {
  return gulp.src(paths.src + '/app/gettext/**/*.po')
    .pipe($.angularGettext.compile({format: 'json'}))
    .pipe($.extend('gettext.catalog.json')) // use .json extension for wrap plugin to load content
    .pipe($.wrap(
      '\'use strict\';\n\n' +
      '/**\n' +
      ' * This module is generated from PO language files located in "' +  paths.src + '/app/gettext" directory.\n' +
      ' * Use a PO file editor like POEdit (http://poedit.net/) to add translations in these files.\n' +
      ' * For more information, angular-gettext documentation is available at https://angular-gettext.rocketeer.be/\n' +
      ' */\n' +
      'angular.module(\'<%= appName %>\').run([\'gettextCatalog\', function (gettextCatalog) {\n' +
      '/* jshint -W100,-W109 */\n' +
      '<'+'% var langs = Object.keys(contents); var i = langs.length; while (i--) {' +
      'var lang = langs[i]; var translations = contents[lang]; %'+'>'+
      '  gettextCatalog.setStrings(\'<'+'%= lang %'+'>\', <'+'%= JSON.stringify(translations, undefined, 2) %'+'>);\n'+
      '<'+'% }; %'+'>' +
      '/* jshint +W100,+W109 */\n' +
      '}]);'))
    .pipe($.rename('gettext.catalog.js')) // rename to javascript
    .pipe(gulp.dest(paths.tmp + '/serve/app/gettext'));
});

gulp.task('gettext', ['gettext:extract', 'gettext:compile']);
