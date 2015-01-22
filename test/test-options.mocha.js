/*global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var outputInTest = require( './mute' );

describe('gulp-angular generator', function () {

  var mockPrompts = require('../app/src/mock-prompts.js');
  var prompts = JSON.parse(JSON.stringify(mockPrompts.prompts));
  var libRegexp = mockPrompts.libRegexp;

  var gulpAngular;
  var folderName = 'tempGulpAngular';

  var genOptions = {
    'skip-install': true,
    'skip-welcome-message': true,
    'skip-message': true,
    'default': true
  };

  var expectedFile = [
    // gulp/ directory
    'gulp/build.js',
    'gulp/inject.js',
    'gulp/watch.js',
    'gulp/proxy.js',
    'gulp/server.js',
    'gulp/unit-tests.js',
    'gulp/e2e-tests.js',

    // src/ directory
    'src/favicon.ico',
    'src/index.html',

    // src/components/navbar/ directory
    'src/components/navbar/navbar.html',

    // root directory
    '.bowerrc',
    '.editorconfig',
    '.gitignore',
    '.jshintrc',
    '.yo-rc.json',
    'bower.json',
    'gulpfile.js',
    'package.json'
  ];

  var expectedGulpContent = [
    ['gulpfile.js', /gulp\.task\('default'/],
    ['gulp/build.js', /gulp\.task\('partials'/],
    ['gulp/build.js', /gulp\.task\('html'/],
    ['gulp/build.js', /gulp\.task\('images'/],
    ['gulp/build.js', /gulp\.task\('fonts'/],
    ['gulp/build.js', /gulp\.task\('misc'/],
    ['gulp/build.js', /gulp\.task\('clean'/],
    ['gulp/build.js', /gulp\.task\('build'/],
    ['gulp/inject.js', /gulp\.task\('inject'/],
    ['gulp/watch.js', /gulp\.task\('watch'/],
    ['gulp/unit-tests.js', /gulp\.task\('test'/],
    ['gulp/e2e-tests.js', /gulp\.task\('webdriver-update'/],
    ['gulp/e2e-tests.js', /gulp\.task\('webdriver-standalone'/],
    ['gulp/e2e-tests.js', /gulp\.task\('protractor:src'/],
    ['gulp/e2e-tests.js', /gulp\.task\('protractor:dist'/],
    ['gulp/server.js', /gulp\.task\('serve'/],
    ['gulp/server.js', /gulp\.task\('serve:dist'/],
    ['gulp/server.js', /gulp\.task\('serve:e2e'/],
    ['gulp/server.js', /gulp\.task\('serve:e2e-dist'/]
  ];

  before(function (done) {

    helpers.testDirectory(path.join(__dirname, folderName), function (err) {
      if (err) {
        done(err);
      }

      gulpAngular = helpers.createGenerator(
        'gulp-angular:app',
        [
          '../../app',
        ],
        false,
        genOptions
      );

      gulpAngular.on('run', outputInTest.mute);
      gulpAngular.on('end', outputInTest.unmute);

      done();
    });
  });

  describe('with --default option', function () {
    it('should generate the expected files and their content', function (done) {

      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          // Option: Javascript
          'src/app/index.js',
          'src/app/main/main.controller.js',
          'src/app/main/main.controller.spec.js',
          'src/components/navbar/navbar.controller.js',
          'karma.conf.js',
          'protractor.conf.js',
          'e2e/main.po.js',
          'e2e/main.spec.js',

          // Option: ngRoute
          'src/app/main/main.html',

          // Option: Sass (Node)
          'src/app/index.scss',
          'src/app/vendor.scss',
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          // Check src/app/index.js
          ['src/app/index.js', /'ngAnimate'/],
          ['src/app/index.js', /'ngCookies'/],
          ['src/app/index.js', /'ngTouch'/],
          ['src/app/index.js', /'ngSanitize'/],
          ['src/app/index.js', /'ngResource'/],
          ['src/app/index.js', /'ngRoute'/],

          // Check src/app/vendor.scss
          ['src/app/vendor.scss', /\$icon-font-path: "\/bower_components\/bootstrap-sass-official\/assets\/fonts\/bootstrap\/";/],
          ['src/app/vendor.scss', /@import '\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/stylesheets\/bootstrap';/],

          // Check bower.json
          ['bower.json', libRegexp('angular', prompts.angularVersion.values['1.3'])],
          ['bower.json', libRegexp('angular-animate', prompts.angularVersion.values['1.3'])],
          ['bower.json', libRegexp('angular-cookies', prompts.angularVersion.values['1.3'])],
          ['bower.json', libRegexp('angular-touch', prompts.angularVersion.values['1.3'])],
          ['bower.json', libRegexp('angular-sanitize', prompts.angularVersion.values['1.3'])],
          ['bower.json', libRegexp('jquery', prompts.jQuery.values['jquery 2'].version)],
          ['bower.json', libRegexp('angular-resource', prompts.angularVersion.values['1.3'])],
          ['bower.json', libRegexp('angular-route', prompts.angularVersion.values['1.3'])],
          ['bower.json', libRegexp('bootstrap-sass-official', prompts.ui.values.bootstrap.version)],

          // Check package.json
          ['package.json', libRegexp('gulp-sass', prompts.cssPreprocessor.values['node-sass'].version)],

          // Check wiredep css exclusion.
          ['gulp/inject.js', /exclude:.*?\/bootstrap\\\.css\/.*?/]
        ]));

        done();
      });
    });
  });
});
