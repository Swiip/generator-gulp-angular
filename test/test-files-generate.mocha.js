/*global describe, beforeEach, it */
'use strict';

var _ = require('lodash');
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var outputInTest = require( './mute' );

describe('gulp-angular generator', function () {

  var mockPrompts = require('./mock-prompts.js');
  var prompts = mockPrompts.prompts;
  var defaults;
  var libRegexp = mockPrompts.libRegexp;

  var gulpAngular;
  var folderName = 'tempGulpAngular';

  var expectedFile = [
    // gulp/ directory
    'gulp/build.js',
    'gulp/e2e-tests.js',
    'gulp/proxy.js',
    'gulp/server.js',
    'gulp/unit-tests.js',
    'gulp/watch.js',
    'gulp/wiredep.js',

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
    ['gulpfile.js', /gulp\.task\(\'default\'/],
    ['gulp/build.js', /gulp\.task\(\'styles\'/],
    ['gulp/build.js', /gulp\.task\(\'scripts\'/],
    ['gulp/build.js', /gulp\.task\(\'partials\'/],
    ['gulp/build.js', /gulp\.task\(\'html\'/],
    ['gulp/build.js', /gulp\.task\(\'images\'/],
    ['gulp/build.js', /gulp\.task\(\'fonts\'/],
    ['gulp/build.js', /gulp\.task\(\'misc\'/],
    ['gulp/build.js', /gulp\.task\(\'clean\'/],
    ['gulp/build.js', /gulp\.task\(\'build\'/],
    ['gulp/unit-tests.js', /gulp\.task\(\'test\'/],
    ['gulp/e2e-tests.js', /gulp\.task\(\'webdriver-update\'/],
    ['gulp/e2e-tests.js', /gulp\.task\(\'webdriver-standalone\'/],
    ['gulp/e2e-tests.js', /gulp\.task\(\'protractor-only\'/],
    ['gulp/e2e-tests.js', /gulp\.task\(\'protractor:src\'/],
    ['gulp/e2e-tests.js', /gulp\.task\(\'protractor:dist\'/],
    ['gulp/server.js', /gulp\.task\(\'serve\'/],
    ['gulp/server.js', /gulp\.task\(\'serve:dist\'/],
    ['gulp/server.js', /gulp\.task\(\'serve:e2e\'/],
    ['gulp/server.js', /gulp\.task\(\'serve:e2e-dist\'/],
    ['gulp/watch.js', /gulp\.task\(\'watch\'/],
    ['gulp/wiredep.js', /gulp\.task\(\'wiredep\'/],
  ];

  var genOptions = {
    'skip-install': true,
    'skip-welcome-message': true,
    'skip-message': true
  };

  beforeEach(function (done) {
    defaults = _.clone(mockPrompts.defaults);

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

      gulpAngular.on('start', outputInTest.mute);
      gulpAngular.on('end', outputInTest.unmute);

      done();
    });
  });

  describe('with default options: [angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, jQuery 1.x.x, ngResource, ngRoute, bootstrap, ui-bootstrap, node-sass]', function () {
    // Default scenario: angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, jQuery 1.x.x, ngResource, ngRoute, bootstrap, node-sass
    it('should generate the expected files and their content', function (done) {
      helpers.mockPrompt(gulpAngular, defaults);

      gulpAngular.run({}, function () {
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
          ['src/app/vendor.scss', /\$icon-font-path: "\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/fonts\/bootstrap\/";/],
          ['src/app/vendor.scss', /\@import '\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/stylesheets\/bootstrap';/],

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
          ['package.json', libRegexp('gulp-sass', prompts.cssPreprocessor.values['node-sass'].npm['gulp-sass'])]
        ]));


        done();
      });
    });
  });

  // Prompt #1: Which version of Angular ?
  describe('with option: [angular 1.2.x]', function () {
    it('should add dependency for angular 1.2.x', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        'angularVersion': prompts.angularVersion.values['1.2']
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', libRegexp('angular', prompts.angularVersion.values['1.2'])]
        ]));
        done();
      });
    });
  });

  // Prompt #2:  Which Angular's modules ?
  describe('without ngModules option', function () {
    it('should NOT add dependency for ngModules', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        angularModules: []
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent(expectedGulpContent);

        assert.noFileContent([
          ['src/app/index.js', /'ngAnimate'/],
          ['src/app/index.js', /'ngCookies'/],
          ['src/app/index.js', /'ngTouch'/],
          ['src/app/index.js', /'ngSanitize'/],
          ['bower.json', /"angular-animate":/],
          ['bower.json', /"angular-cookies":/],
          ['bower.json', /"angular-touch":/],
          ['bower.json', /"angular-sanitize":/],
        ]);
        done();
      });
    });
  });

  // Prompt #3: Which JavaScript library ?
  describe('with option: [jQuery 2.x.x]', function () {
    it('should add dependency for jQuery 2.x.x', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        jQuery: prompts.jQuery.values['jquery 2']
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', libRegexp('jquery', prompts.jQuery.values['jquery 2'].version)]
        ]));
        done();
      });
    });
  });
  describe('with option: [ZeptoJS 1.1.x]', function () {
    it('should add dependency for ZeptoJS 1.1.x', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        jQuery: prompts.jQuery.values['zeptojs 1.1']
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', libRegexp('zeptojs', prompts.jQuery.values['zeptojs 1.1'].version)]
        ]));
        done();
      });
    });
  });
  describe('with option: [jqLite]', function () {
    it('should NOT add dependency for jqLite', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        jQuery: prompts.jQuery.values.none
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent(expectedGulpContent);

        assert.noFileContent([
          ['bower.json', /"jquery:"/],
          ['bower.json', /"zeptojs:"/]
        ]);
        done();
      });
    });
  });

  // Prompt #4: Which Angular's modules for RESTful resource interaction ?
  describe('with option: [Restangular]', function () {
    it('should add dependency for Restangular', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        resource: prompts.resource.values.restangular
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/index.js', /'restangular'/],
          ['bower.json', libRegexp('restangular', prompts.resource.values.restangular.version)]
        ]));

        done();
      });
    });
  });

  describe('with option: [$http]', function () {
    it('should NOT add dependency for $http', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        resource: prompts.resource.values.none
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent(expectedGulpContent);

        assert.noFileContent([
          ['src/app/index.js', /'ngResource'/],
          ['src/app/index.js', /'restangular'/],
          ['bower.json', libRegexp('angular-resource', prompts.resource.values['angular-resource'].version)],
          ['bower.json', libRegexp('restangular', prompts.resource.values.restangular.version)]
        ]);

        done();
      });
    });
  });

  // Prompt #5: Which Angular's modules for routing ?
  describe('with option: [UI Router]', function () {
    it('should add dependency for UI Router', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        router: prompts.router.values['angular-ui-router']
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/main/main.html',
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/index.js', /'ui.router'/],
          ['bower.json', libRegexp('angular-ui-router', prompts.router.values['angular-ui-router'].version)]
        ]));

        done();
      });
    });
  });
  describe('without router option', function () {
    it('should NOT add dependency', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        router: prompts.router.values.none
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.noFile('src/app/main/main.html');

        assert.fileContent(expectedGulpContent);

        assert.noFileContent([
          ['src/app/index.js', /'ngRoute'/],
          ['src/app/index.js', /'ui.router'/],
          ['bower.json', libRegexp('angular-route', prompts.router.values['angular-route'].version)],
          ['bower.json', libRegexp('angular-ui-router', prompts.router.values['angular-ui-router'].version)]
        ]);

        done();
      });
    });
  });

  // Prompt #6: Which UI framework ?
  describe('with option: [Foundation, Node SASS]', function () {
    it('should add dependency for Foundation with SASS', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        ui: prompts.ui.values.foundation
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.scss', /\@import '..\/..\/bower_components\/foundation\/scss\/foundation';/],
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)],
          ['package.json', libRegexp('gulp-sass', prompts.cssPreprocessor.values['node-sass'].npm['gulp-sass'])]
        ]));

        done();
      });
    });
  });
  describe('with option: [Foundation, Ruby SASS]', function () {
    it('should add dependency for Foundation with SASS', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        ui: prompts.ui.values.foundation,
        cssPreprocessor: prompts.cssPreprocessor.values['ruby-sass']
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.scss', /\@import '..\/..\/bower_components\/foundation\/scss\/foundation';/],
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)],
          ['package.json', libRegexp('gulp-ruby-sass', prompts.cssPreprocessor.values['ruby-sass'].npm['gulp-ruby-sass'])]
        ]));

        done();
      });
    });
  });
  describe('with option: [Foundation, LESS]', function () {
    it('should add dependency for Foundation with LESS', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        ui: prompts.ui.values.foundation,
        cssPreprocessor: prompts.cssPreprocessor.values.less
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.less'
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)],
          ['package.json', libRegexp('gulp-less', prompts.cssPreprocessor.values.less.npm['gulp-less'])]
        ]));

        done();
      });
    });
  });
  describe('with option: [Foundation, Stylus]', function () {
    it('should add dependency for Foundation with Stylus', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        ui: prompts.ui.values.foundation,
        cssPreprocessor: prompts.cssPreprocessor.values.stylus
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.styl'
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)],
          ['package.json', libRegexp('gulp-stylus', prompts.cssPreprocessor.values.stylus.npm['gulp-stylus'])]
        ]));

        done();
      });
    });
  });
  describe('with option: [Foundation, CSS]', function () {
    it('should add dependency for Foundation with CSS', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        ui: prompts.ui.values.foundation,
        cssPreprocessor: prompts.cssPreprocessor.values.css
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.css',
        ]));

        assert.noFile('src/app/vendor.*');

        // No Gulp task for style
        assert.fileContent([
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)]
        ]);
        done();
      });
    });
  });
  describe('with option: [Bootstrap, Ruby SASS]', function () {
    it('should add dependency for Bootstrap with SASS', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        ui: prompts.ui.values.bootstrap,
        cssPreprocessor: prompts.cssPreprocessor.values['ruby-sass']
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.scss',
          'src/app/vendor.scss',
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.scss', /\$icon-font-path: "\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/fonts\/bootstrap\/";/],
          ['src/app/vendor.scss', /\@import '\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/stylesheets\/bootstrap';/],
          ['bower.json', libRegexp('bootstrap-sass-official', prompts.ui.values.bootstrap.version)],
          ['package.json', libRegexp('gulp-ruby-sass', prompts.cssPreprocessor.values['ruby-sass'].npm['gulp-ruby-sass'])],
        ]));

        done();
      });
    });
  });
  describe('with option: [Bootstrap, LESS]', function () {
    it('should add dependency for Bootstrap with LESS', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        ui: prompts.ui.values.bootstrap,
        cssPreprocessor: prompts.cssPreprocessor.values.less
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.less',
          'src/app/vendor.less',
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.less', /@import '..\/..\/bower_components\/bootstrap\/less\/bootstrap.less';/],
          ['src/app/vendor.less', /\@icon-font-path: '\/bower_components\/bootstrap\/fonts\/';/],
          ['bower.json', libRegexp('bootstrap', prompts.ui.values.bootstrap.version)],
          ['package.json', libRegexp('gulp-less', prompts.cssPreprocessor.values.less.npm['gulp-less'])]
        ]));

        done();
      });
    });
  });
  describe('with option: [Bootstrap, Stylus]', function () {
    it('should add dependency for Bootstrap with Stylus', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        ui: prompts.ui.values.bootstrap,
        cssPreprocessor: prompts.cssPreprocessor.values.stylus
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.styl',
        ]));

        assert.noFile('src/app/vendor.*');

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/index.html', /<link rel="stylesheet" href="..\/bower_components\/bootstrap\/dist\/css\/bootstrap.css">/],
          ['bower.json', libRegexp('bootstrap', prompts.ui.values.bootstrap.version)],
          ['package.json', libRegexp('gulp-stylus', prompts.cssPreprocessor.values.stylus.npm['gulp-stylus'])]
        ]));

        done();
      });
    });
  });
  describe('with option: [Bootstrap, CSS]', function () {
    it('should add dependency for Bootstrap with CSS', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        ui: prompts.ui.values.bootstrap,
        cssPreprocessor: prompts.cssPreprocessor.values.css
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.css',
        ]));

        assert.noFile('src/app/vendor.*');

        // No Gulp task for style
        assert.fileContent([
          ['bower.json', libRegexp('bootstrap', prompts.ui.values.bootstrap.version)]
        ]);

        assert.noFileContent([
          ['package.json', libRegexp('gulp-less', prompts.cssPreprocessor.values.less.npm['gulp-less'])],
          ['package.json', libRegexp('gulp-sass', prompts.cssPreprocessor.values['node-sass'].npm['gulp-sass'])],
          ['package.json', libRegexp('gulp-ruby-sass', prompts.cssPreprocessor.values['ruby-sass'].npm['gulp-ruby-sass'])]
        ]);

        done();
      });
    });
  });
  describe('with option: [Bootstrap, UI Boostrap]', function () {
    it('should add UI Bootstrap Bower and Angular module', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        bootstrapComponents: prompts.bootstrapComponents.values['ui-bootstrap']
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([
          ['bower.json', libRegexp('angular-bootstrap', prompts.bootstrapComponents.values['ui-bootstrap'].version)],
          ['src/app/index.js', /'ui.bootstrap'/]
        ]);

        done();
      });
    });
  });
  describe('with option: [Bootstrap, Standard Boostrap JS]', function () {
    it('should add Bootstrap JS files', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        bootstrapComponents: prompts.bootstrapComponents.values.official
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.noFileContent([
          ['gulp/wiredep.js', /\/bootstrap.js\//]
        ]);

        done();
      });
    });
  });
  describe('with option: [Angular Material]', function () {
    it('should add Angular Material Bower and Angular modules', function (done) {
      helpers.mockPrompt(gulpAngular, _.assign(defaults, {
        ui: prompts.ui.values['angular-material']
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.noFile('src/app/vendor.*');

        assert.fileContent([
          ['bower.json', libRegexp('angular-material', prompts.ui.values['angular-material'].version)],
          ['src/app/index.js', /'ngMaterial'/]
        ]);

        done();
      });
    });
  });

  // For future case
  /*
  describe('with option: []', function () {
    it('should', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(prompt, {
        // jQuery: {
        //   "name": null,
        //   "version": "1.1.x"
        // }
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent(expectedGulpContent);

        done();
      });
    });
  });
  */
});
