/*global describe, beforeEach, it */
'use strict';

var _ = require('lodash');
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var outputInTest = require( './mute' );

describe('gulp-angular generator', function () {
  var mockPrompts = require('../app/src/mock-prompts.js');
  var mockOptions = require('../app/src/mock-options.js');

  var prompts = _.cloneDeep(mockPrompts.prompts);

  var defaultPrompts = mockPrompts.defaults;
  var defaultOptions = mockOptions.defaults;

  var promptCase;
  var optionCase;

  var skipOptions = {
    'skip-install': true,
    'skip-welcome-message': true,
    'skip-message': true
  };

  var libRegexp = mockPrompts.libRegexp;

  var gulpAngular;
  var folderName = 'tempGulpAngular';

  var expectedFile;

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
    ['gulp/unit-tests.js', /gulp\.task\('test:auto'/],
    ['gulp/e2e-tests.js', /gulp\.task\('webdriver-update'/],
    ['gulp/e2e-tests.js', /gulp\.task\('webdriver-standalone'/],
    ['gulp/e2e-tests.js', /gulp\.task\('protractor:src'/],
    ['gulp/e2e-tests.js', /gulp\.task\('protractor:dist'/],
    ['gulp/server.js', /gulp\.task\('serve'/],
    ['gulp/server.js', /gulp\.task\('serve:dist'/],
    ['gulp/server.js', /gulp\.task\('serve:e2e'/],
    ['gulp/server.js', /gulp\.task\('serve:e2e-dist'/]
  ];

  beforeEach(function (done) {
    expectedFile = [
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
        optionCase
      );
      helpers.mockPrompt(gulpAngular, promptCase);

      gulpAngular.on('run', outputInTest.mute);
      gulpAngular.on('end', outputInTest.unmute);

      done();
    });
  });

  describe('with default config: [src, dist, e2e, .tmp] [angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, jQuery 1.x.x, ngResource, ngRoute, bootstrap, ui-bootstrap, node-sass, Standard JS, No HTML preprocessor]', function () {
    // Default scenario: angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, jQuery 1.x.x, ngResource, ngRoute, bootstrap, node-sass, standard js, jade
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.cloneDeep(defaultPrompts);
    });

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

        assert.noFile([
          'src/**/*.ts',
          'src/**/*.coffee'
        ]);

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
          ['gulp/inject.js', /exclude:.*?\/bootstrap\\\.css\/.*?/],

          // Check font-path replace in html
          ['gulp/build.js', /\/bower_components\/bootstrap-sass-official\/assets\/fonts\/bootstrap\//]
        ]));

        assert.noFileContent([].concat([
          // Check no markups
          ['gulp/build.js', /gulp\.task\('partials'.*?'markups'/]
        ]));

        done();
      });
    });
  });

  // Prompt #1: Which version of Angular ?
  describe('with prompt: [angular 1.2.x]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        'angularVersion': prompts.angularVersion.values['1.2']
      });
    });

    it('should add dependency for angular 1.2.x', function (done) {
      gulpAngular.run(function () {
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
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        angularModules: []
      });
    });

    it('should NOT add dependency for ngModules', function (done) {
      gulpAngular.run(function () {
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
  describe('with prompt: [jQuery 2.x.x]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        jQuery: prompts.jQuery.values['jquery 2']
      });
    });

    it('should add dependency for jQuery 2.x.x', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', libRegexp('jquery', prompts.jQuery.values['jquery 2'].version)]
        ]));
        done();
      });
    });
  });
  describe('with prompt: [ZeptoJS 1.1.x]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        jQuery: prompts.jQuery.values['zeptojs 1.1']
      });
    });

    it('should add dependency for ZeptoJS 1.1.x', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', libRegexp('zeptojs', prompts.jQuery.values['zeptojs 1.1'].version)]
        ]));
        done();
      });
    });
  });
  describe('with prompt: [jqLite]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        jQuery: prompts.jQuery.values.none
      });
    });

    it('should NOT add dependency for jqLite', function (done) {
      gulpAngular.run(function () {
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
  describe('with prompt: [Restangular]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        resource: prompts.resource.values.restangular
      });
    });

    it('should add dependency for Restangular', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/index.js', /'restangular'/],
          ['bower.json', libRegexp('restangular', prompts.resource.values.restangular.version)]
        ]));

        done();
      });
    });
  });

  describe('with prompt: [$http]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        resource: prompts.resource.values.none
      });
    });

    it('should NOT add dependency for $http', function (done) {
      gulpAngular.run(function () {
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
  describe('with prompt: [UI Router]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        router: prompts.router.values['angular-ui-router']
      });
    });

    it('should add dependency for UI Router', function (done) {
      gulpAngular.run(function () {
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
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        router: prompts.router.values.none
      });
    });

    it('should NOT add dependency', function (done) {
      gulpAngular.run(function () {
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
  describe('with prompt: [Foundation, angular-foundation, Node SASS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.foundation,
        foundationComponents: prompts.foundationComponents.values['angular-foundation']
      });
    });

    it('should add dependency for Foundation with SASS', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'gulp/styles.js',
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.scss', /@import '..\/..\/bower_components\/foundation\/scss\/foundation';/],
          ['bower.json', libRegexp('angular-foundation', prompts.foundationComponents.values['angular-foundation'].version)],
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)],

          ['package.json', libRegexp('gulp-sass', prompts.cssPreprocessor.values['node-sass'].version)],
          ['gulp/inject.js', /exclude:.*?\/foundation\\\.css\/.*?/]
        ]));

        done();
      });
    });
  });
  describe('with prompt: [Foundation, angular-foundation, Ruby SASS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.foundation,
        foundationComponents: prompts.foundationComponents.values['angular-foundation'],
        cssPreprocessor: prompts.cssPreprocessor.values['ruby-sass']
      });
    });

    it('should add dependency for Foundation with SASS', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.scss', /@import '..\/..\/bower_components\/foundation\/scss\/foundation';/],
          ['bower.json', libRegexp('angular-foundation', prompts.foundationComponents.values['angular-foundation'].version)],
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)],

          ['package.json', libRegexp('gulp-ruby-sass', prompts.cssPreprocessor.values['ruby-sass'].version)],
          ['gulp/inject.js', /exclude:.*?\/foundation\\\.css\/.*?/]
        ]));

        done();
      });
    });
  });
  describe('with prompt: [Foundation, angular-foundation, LESS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.foundation,
        foundationComponents: prompts.foundationComponents.values['angular-foundation'],
        cssPreprocessor: prompts.cssPreprocessor.values.less
      });
    });

    it('should add dependency for Foundation with LESS', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.less'
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)],
          ['bower.json', libRegexp('angular-foundation', prompts.foundationComponents.values['angular-foundation'].version)],
          ['package.json', libRegexp('gulp-less', prompts.cssPreprocessor.values.less.version)],
          ['gulp/inject.js', /exclude:.*?\/foundation\\\.css\/.*?/]
        ]));

        done();
      });
    });
  });
  describe('with prompt: [Foundation, angular-foundation, Stylus]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.foundation,
        foundationComponents: prompts.foundationComponents.values['angular-foundation'],
        cssPreprocessor: prompts.cssPreprocessor.values.stylus
      });
    });

    it('should add dependency for Foundation with Stylus', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.styl'
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)],
          ['bower.json', libRegexp('angular-foundation', prompts.foundationComponents.values['angular-foundation'].version)],
          ['package.json', libRegexp('gulp-stylus', prompts.cssPreprocessor.values.stylus.version)],
          ['gulp/inject.js', /exclude:.*?\/foundation\\\.css\/.*?/]
        ]));

        done();
      });
    });
  });
  describe('with prompt: [Foundation, angular-foundation, CSS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.foundation,
        foundationComponents: prompts.foundationComponents.values['angular-foundation'],
        cssPreprocessor: prompts.cssPreprocessor.values.none
      });
    });

    it('should add dependency for Foundation with CSS', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.css',
        ]));

        assert.noFile('src/app/vendor.*');

        // No Gulp task for style
        assert.fileContent([
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)],
          ['bower.json', libRegexp('angular-foundation', prompts.foundationComponents.values['angular-foundation'].version)]
        ]);
        // No Gulp task for style
        assert.noFileContent([
          ['gulp/inject.js', /exclude:.*?\/foundation\\\.css\/.*?/]
        ]);
        done();
      });
    });
  });
  describe('with prompt: [Foundation, Official, CSS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.foundation,
        cssPreprocessor: prompts.cssPreprocessor.values.none,
        foundationComponents: prompts.foundationComponents.values.official
      });
    });

    it('should not add angular-foundation', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.css',
        ]));

        assert.noFile('src/app/vendor.*');

        // No Gulp task for style
        assert.fileContent([
          ['bower.json', libRegexp('foundation', prompts.ui.values.foundation.version)],
        ]);

        // No Gulp task for style
        assert.noFileContent([
          ['bower.json', libRegexp('angular-foundation', prompts.foundationComponents.values['angular-foundation'].version)],
          ['gulp/inject.js', /exclude:.*?\/foundation\\\.css\/.*?/]
        ]);
        done();
      });
    });
  });
  describe('with prompt: [Bootstrap, Ruby SASS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.bootstrap,
        cssPreprocessor: prompts.cssPreprocessor.values['ruby-sass']
      });
    });

    it('should add dependency for Bootstrap with SASS', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.scss',
          'src/app/vendor.scss',
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.scss', /\$icon-font-path: "\/bower_components\/bootstrap-sass-official\/assets\/fonts\/bootstrap\/";/],
          ['src/app/vendor.scss', /@import '\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/stylesheets\/bootstrap';/],
          ['bower.json', libRegexp('bootstrap-sass-official', prompts.ui.values.bootstrap.version)],
          ['package.json', libRegexp('gulp-ruby-sass', prompts.cssPreprocessor.values['ruby-sass'].version)],
          ['gulp/inject.js', /exclude:.*?\/bootstrap\\\.css\/.*?/]
        ]));

        done();
      });
    });
  });
  describe('with prompt: [Bootstrap, LESS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.bootstrap,
        cssPreprocessor: prompts.cssPreprocessor.values.less
      });
    });

    it('should add dependency for Bootstrap with LESS', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.less',
          'src/app/vendor.less',
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.less', /@import '\.\.\/\.\.\/bower_components\/bootstrap\/less\/bootstrap\.less';/],
          ['src/app/vendor.less', /@icon-font-path: '\/bower_components\/bootstrap\/fonts\/';/],
          ['bower.json', libRegexp('bootstrap', prompts.ui.values.bootstrap.version)],
          ['package.json', libRegexp('gulp-less', prompts.cssPreprocessor.values.less.version)],
          ['gulp/inject.js', /exclude:.*?\/bootstrap\\\.css\/.*?/]
        ]));

        done();
      });
    });
  });
  describe('with prompt: [Bootstrap, Stylus]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.bootstrap,
        cssPreprocessor: prompts.cssPreprocessor.values.stylus
      });
    });

    it('should add dependency for Bootstrap with Stylus', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.styl',
        ]));

        assert.noFile('src/app/vendor.*');

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/index.html', /<link rel="stylesheet" href="..\/bower_components\/bootstrap\/dist\/css\/bootstrap.css">/],
          ['bower.json', libRegexp('bootstrap', prompts.ui.values.bootstrap.version)],
          ['package.json', libRegexp('gulp-stylus', prompts.cssPreprocessor.values.stylus.version)],
          ['gulp/inject.js', /exclude:.*?\/bootstrap\\\.css\/.*?/]
        ]));

        done();
      });
    });
  });
  describe('with prompt: [Bootstrap, CSS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.bootstrap,
        cssPreprocessor: prompts.cssPreprocessor.values.none
      });
    });

    it('should add dependency for Bootstrap with CSS', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.css',
        ]));

        assert.noFile('src/app/vendor.*');

        // No Gulp task for style
        assert.fileContent([
          ['bower.json', libRegexp('bootstrap', prompts.ui.values.bootstrap.version)]
        ]);

        assert.noFileContent([
          ['package.json', libRegexp('gulp-less', prompts.cssPreprocessor.values.less.version)],
          ['package.json', libRegexp('gulp-sass', prompts.cssPreprocessor.values['node-sass'].version)],
          ['package.json', libRegexp('gulp-ruby-sass', prompts.cssPreprocessor.values['ruby-sass'].version)],
          ['gulp/inject.js', /exclude:.*\/bootstrap\\\.css\/.*/]
        ]);

        done();
      });
    });
  });
  describe('with prompt: [Bootstrap, UI Boostrap]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        bootstrapComponents: prompts.bootstrapComponents.values['ui-bootstrap']
      });
    });

    it('should add UI Bootstrap Bower and Angular module', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.fileContent([
          ['bower.json', libRegexp('angular-bootstrap', prompts.bootstrapComponents.values['ui-bootstrap'].version)],
          ['src/app/index.js', /'ui.bootstrap'/]
        ]);

        done();
      });
    });
  });
  describe('with prompt: [Bootstrap, Standard Boostrap JS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        bootstrapComponents: prompts.bootstrapComponents.values.official
      });
    });

    it('should add Bootstrap JS files', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.noFileContent([
          ['gulp/inject.js', /\/bootstrap\\\.js\//]
        ]);

        done();
      });
    });
  });
  describe('with prompt: [Angular Material]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values['angular-material']
      });
    });

    it('should add Angular Material Bower and Angular modules', function (done) {
      gulpAngular.run(function () {
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
  describe('with prompt: [None UI Framework, Node SASS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.none,
        cssPreprocessor: prompts.cssPreprocessor.values['node-sass']
      });
    });

    it('should add index style', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          // Check package.json
          ['package.json', libRegexp('gulp-sass', prompts.cssPreprocessor.values['node-sass'].version)]
        ]));

        assert.noFile('src/app/vendor.*');

        done();
      });
    });
  });
  describe('with prompt: [None UI Framework, Ruby SASS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.none,
        cssPreprocessor: prompts.cssPreprocessor.values['ruby-sass']
      });
    });

    it('should add index style', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          // Check package.json
          ['package.json', libRegexp('gulp-ruby-sass', prompts.cssPreprocessor.values['ruby-sass'].version)]
        ]));

        assert.noFile('src/app/vendor.*');

        done();
      });
    });
  });
  describe('with prompt: [None UI Framework, LESS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.none,
        cssPreprocessor: prompts.cssPreprocessor.values.less
      });
    });

    it('should add index style', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          // Check package.json
          ['package.json', libRegexp('gulp-less', prompts.cssPreprocessor.values.less.version)]
        ]));

        assert.noFile('src/app/vendor.*');

        done();
      });
    });
  });
  describe('with prompt: [None UI Framework, Stylus]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.none,
        cssPreprocessor: prompts.cssPreprocessor.values.stylus
      });
    });

    it('should add index style', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          // Check package.json
          ['package.json', libRegexp('gulp-stylus', prompts.cssPreprocessor.values.stylus.version)]
        ]));

        assert.noFile('src/app/vendor.*');

        done();
      });
    });
  });
  describe('with prompt: [None UI Framework, CSS]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        ui: prompts.ui.values.none,
        cssPreprocessor: prompts.cssPreprocessor.values.none
      });
    });

    it('should add index style', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.noFile('src/app/vendor.*');

        done();
      });
    });
  });
  describe('with prompt: [None JS Preprocessor]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        jsPreprocessor: prompts.jsPreprocessor.values.none
      });
    });

    it('should not add browerify and inject js files from src', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.noFile([
          'src/**/*.ts',
          'src/**/*.coffee'
        ]);

        assert.fileContent([].concat(expectedGulpContent, [
          ['gulp/inject.js', /gulp\.task\(\'inject\', \[\'styles\'\]/],
          ['gulp/inject.js', /paths\.src \+ '\/{app,components}\/\*\*\/\*\.js'/]
        ]));

        assert.noFileContent([
          ['gulp/build.js', /gulp\.task\(\'browserify\'/],
          ['package.json', /gulp-browserify/]
        ]);

        done();
      });
    });
  });
  describe('with prompt: [CoffeeScript]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        jsPreprocessor: prompts.jsPreprocessor.values.coffee
      });
    });

    it('should not add browerify and add gulp-coffee', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.coffee',
          'src/app/main/main.controller.coffee',
          'src/components/navbar/navbar.controller.coffee',
          'coffeelint.json'
        ]));

        assert.noFile([
          'src/app/index.js',
          'src/app/main/main.controller.js',
          'src/components/navbar/navbar.controller.js',
          'src/**/*.ts'
        ]);

        assert.fileContent([].concat(expectedGulpContent, [
          ['gulp/inject.js', /gulp\.task\('inject', \['styles', 'scripts'\]/],
          ['gulp/inject.js', /'{' \+ paths\.src \+ ',' \+ paths\.tmp \+ '\/serve}\/{app,components}\/\*\*\/\*\.js',/],
          ['package.json', /gulp-coffee/],
          ['package.json', /gulp-coffeelint/]
        ]));

        assert.noFileContent([
          ['gulp/build.js', /gulp\.task\(\'browserify\'/],
          ['package.json', /gulp-browserify/]
        ]);

        done();
      });
    });
  });
  describe('with prompt: [6to5]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        jsPreprocessor: prompts.jsPreprocessor.values['6to5']
      });
    });

    it('should add browerify and gulp-6to5', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.js',
          'src/app/main/main.controller.js',
          'src/components/navbar/navbar.controller.js'
        ]));

        assert.noFile([
          'src/**/*.coffee',
          'src/**/*.ts'
        ]);

        assert.fileContent([].concat(expectedGulpContent, [
          ['gulp/scripts.js', /gulp\.task\(\'browserify\'/],
          ['gulp/inject.js', /gulp\.task\('inject', \['styles', 'browserify'\]/],
          ['gulp/inject.js', /paths\.tmp \+ '\/serve\/{app,components}\/\*\*\/\*\.js',/],
          ['package.json', /gulp-6to5/],
          ['package.json', /gulp-browserify/]
        ]));

        done();
      });
    });
  });
  describe('with prompt: [Traceur]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        jsPreprocessor: prompts.jsPreprocessor.values.traceur
      });
    });

    it('should add browerify and gulp-traceur and traceur-runtime', function (done) {
      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.file([].concat(expectedFile, [
          'src/app/index.js',
          'src/app/main/main.controller.js',
          'src/components/navbar/navbar.controller.js'
        ]));

        assert.noFile([
          'src/**/*.coffee',
          'src/**/*.ts'
        ]);

        assert.fileContent([].concat(expectedGulpContent, [
          ['gulp/scripts.js', /gulp\.task\(\'browserify\'/],
          ['gulp/inject.js', /gulp\.task\('inject', \['styles', 'browserify'\]/],
          ['gulp/inject.js', /paths\.tmp \+ '\/serve\/{app,components}\/\*\*\/\*\.js',/],
          ['package.json', /gulp-traceur/],
          ['package.json', /gulp-browserify/],
          ['bower.json', /traceur-runtime/]
        ]));

        done();
      });
    });
  });
  describe('with prompt: [TypeScript]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        jsPreprocessor: prompts.jsPreprocessor.values.typescript
      });
    });

    it('should not add browserify, but gulp-typescript and tsd gulpfile', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          'src/app/index.ts',
          'src/app/main/main.controller.ts',
          'src/components/navbar/navbar.controller.ts',
          'gulp/tsd.js',
          'tslint.json'
        ]));

        assert.noFile([
          'src/app/index.js',
          'src/app/main/main.controller.js',
          'src/components/navbar/navbar.controller.js',
          'src/**/*.coffee'
        ]);

        assert.fileContent([].concat(expectedGulpContent, [
          ['gulp/inject.js', /gulp\.task\('inject', \['styles', 'scripts'\]/],
          ['gulp/inject.js', /'{' \+ paths\.src \+ ',' \+ paths\.tmp \+ '\/serve}\/{app,components}\/\*\*\/\*\.js',/],
          ['package.json', /gulp-typescript/],
          ['gulp/build.js', /gulp\.task\('clean', \['tsd:purge']/],
          ['gulp/scripts.js', /gulp\.task\('scripts', \['tsd:install']/]
        ]));

        assert.noFileContent([
          ['gulp/build.js', /gulp\.task\(\'browserify\'/],
          ['package.json', /gulp-browserify/]
        ]);

        done();
      });
    });
  });

  describe('with prompt: [Jade HTML Preprocessor]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions), skipOptions);
      promptCase = _.assign(_.cloneDeep(defaultPrompts), {
        htmlPreprocessor: prompts.htmlPreprocessor.values.jade
      });
    });

    it('should not have consolidate gulp task', function (done) {
      gulpAngular.run(function () {
        assert.file([].concat(_.clone(expectedFile), [
          'gulp/markups.js'
        ]));

        assert.fileContent([
          ['gulp/build.js', /gulp\.task\('partials', \['markups'\]/],
          ['gulp/markups.js', /gulp\.task\('markups'/],
          ['gulp/markups.js', /return gulp\.src\(paths\.src \+ '\/{app,components}\/\*\*\/\*\.jade'\)/],
          ['gulp/markups.js', /\.pipe\(\$\.consolidate\('jade'/],
          ['gulp/watch.js', /gulp\.watch\(paths\.src \+ '\/{app,components}\/\*\*\/\*\.jade', \['markups'\]\);/]
        ]);

        done();
      });
    });
  });

  describe('with paths: [src:path/to/public e2e:path/to/e2e/test dist:path/to/dist tmp:.tmp/folder]', function () {
    before(function () {
      optionCase = _.assign(_.cloneDeep(defaultOptions),
        _.merge({
          'app-path': 'path/to/public',
          'dist-path': 'path/to/dist',
          'e2e-path': 'path/to/test',
          'tmp': '.tmp/folder'
        }, skipOptions));
      promptCase = _.cloneDeep(defaultPrompts);
    });

    it('should generate the expected files and their content', function (done) {
      expectedFile = _.map(expectedFile, function(file) {
        if (file.indexOf('src') === 0) {
          return file.replace('src', optionCase['app-path']);
        }
        return file;
      });

      gulpAngular.run(function () {
        assert.file([].concat(expectedFile, [
          // Option: Javascript
          optionCase['app-path'] + '/app/index.js',
          optionCase['app-path'] + '/app/main/main.controller.js',
          optionCase['app-path'] + '/app/main/main.controller.spec.js',
          optionCase['app-path'] + '/components/navbar/navbar.controller.js',
          'karma.conf.js',
          'protractor.conf.js',
          optionCase['e2e-path'] + '/main.po.js',
          optionCase['e2e-path'] + '/main.spec.js',

          // Option: ngRoute
          optionCase['app-path'] + '/app/main/main.html',

          // Option: Sass (Node)
          optionCase['app-path'] + '/app/index.scss',
          optionCase['app-path'] + '/app/vendor.scss',
        ]));

        assert.noFile([
          optionCase['app-path'] + '/**/*.ts',
          optionCase['app-path'] + '/**/*.coffee'
        ]);

        assert.fileContent([].concat(expectedGulpContent, [
          // Check src/app/index.js
          [optionCase['app-path'] + '/app/index.js', /'ngAnimate'/],
          [optionCase['app-path'] + '/app/index.js', /'ngCookies'/],
          [optionCase['app-path'] + '/app/index.js', /'ngTouch'/],
          [optionCase['app-path'] + '/app/index.js', /'ngSanitize'/],
          [optionCase['app-path'] + '/app/index.js', /'ngResource'/],
          [optionCase['app-path'] + '/app/index.js', /'ngRoute'/],

          // Check src/app/vendor.scss
          [optionCase['app-path'] + '/app/vendor.scss', /\$icon-font-path: "\/bower_components\/bootstrap-sass-official\/assets\/fonts\/bootstrap\/";/],
          [optionCase['app-path'] + '/app/vendor.scss', /@import '\.\.\/\.\.\/\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/stylesheets\/bootstrap';/],

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

  // For future case
  /*
  describe('with prompt: []', function () {
    it('should', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(prompt, {
        // jQuery: {
        //   "name": null,
        //   "version": "1.1.x"
        // }
      }));

      gulpAngular.run(function () {
        assert.file(expectedFile);

        assert.fileContent(expectedGulpContent);

        done();
      });
    });
  });
  */
});
