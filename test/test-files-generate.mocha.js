/*global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var outputInTest = require( './mute' );

describe('gulp-angular generator', function () {

  var mockPrompts;
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
    // http://stackoverflow.com/a/9804910/2857943
    // require only reads the file once, following calls return the result from cache
    delete require.cache[require.resolve('./mock-prompts.json')];
    mockPrompts = require('./mock-prompts.json');

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

  describe('with default options: [angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, jQuery 1.x.x, ngResource, ngRoute, bootstrap, node-sass]', function () {
    // Default scenario: angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, jQuery 1.x.x, ngResource, ngRoute, bootstrap, node-sass
    it('should generate the expected files and their content', function (done) {
      helpers.mockPrompt(gulpAngular, mockPrompts.default);

      gulpAngular.run({}, function () {
        assert.file([].concat(expectedFile, [
          // Option: Javascript
          'src/app/index.js',
          'src/app/main/main.controller.js',
          'src/components/navbar/navbar.controller.js',
          'test/karma.conf.js',
          'test/protractor.conf.js',
          'test/e2e/main.js',
          'test/unit/main.js',

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
          ['bower.json', /"angular": "1.3.x"/],
          ['bower.json', /"angular-animate": "1.3.x"/],
          ['bower.json', /"angular-cookies": "1.3.x"/],
          ['bower.json', /"angular-touch": "1.3.x"/],
          ['bower.json', /"angular-sanitize": "1.3.x"/],
          ['bower.json', /"jquery": "1.x.x"/],
          ['bower.json', /"angular-resource": "1.3.x"/],
          ['bower.json', /"angular-route": "1.3.x"/],
          ['bower.json', /"bootstrap-sass-official": "3.2.x"/],

          // Check package.json
          ['package.json', /"gulp-sass": "\^0.7.3"/],
        ]));


        done();
      });
    });
  });

  // Prompt #1: Which version of Angular ?
  describe('with option: [angular 1.2.x]', function () {
    it('should add dependency for angular 1.2.x', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        angularVersion: "1.2.x"
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', /"angular": "1.2.x"/]
        ]));
        done();
      });
    });
  });

  // Prompt #2:  Which Angular's modules ?
  describe('without ngModules option', function () {
    it('should NOT add dependency for ngModules', function (done) {
      var _ = gulpAngular._;
      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
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
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        jQuery: {
          "name": "jquery",
          "version": "2.x.x"
        }
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', /"jquery": "2.x.x"/]
        ]));
        done();
      });
    });
  });
  describe('with option: [ZeptoJS 1.1.x]', function () {
    it('should add dependency for ZeptoJS 1.1.x', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        jQuery: {
          "name": "zeptojs",
          "version": "1.1.x"
        }
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['bower.json', /"zeptojs": "1.1.x"/]
        ]));
        done();
      });
    });
  });
  describe('with option: [jqLite]', function () {
    it('should NOT add dependency for jqLite', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        jQuery: {
          "name": null,
          "version": "1.1.x"
        }
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
      var _ = gulpAngular._;
      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        resource: {
          "name": "restangular",
          "version": "1.4.x",
          "module": "restangular"
        },
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/index.js', /'restangular'/],
          ['bower.json', /"restangular": "1.4.x"/],
        ]));

        done();
      });
    });
  });
  describe('with option: [$http]', function () {
    it('should NOT add dependency for $http', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        resource: {
          "name": null,
          "version": "1.2.x",
          "module": null
        },
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent(expectedGulpContent);

        assert.noFileContent([
          ['src/app/index.js', /'ngResource'/],
          ['src/app/index.js', /'restangular'/],
          ['bower.json', /"angular-resource": "1.3.x"/],
          ['bower.json', /"restangular": "1.3.x"/],
        ]);

        done();
      });
    });
  });

  // Prompt #5: Which Angular's modules for routing ?
  describe('with option: [UI Router]', function () {
    it('should add dependency for UI Router', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
       router: {
          "name": "angular-ui-router",
          "version": "0.2.x",
          "module": "ui.router"
        },
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/main/main.html',
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/index.js', /'ui.router'/],
          ['bower.json', /"angular-ui-router": "0.2.x"/],
        ]));

        done();
      });
    });
  });
  describe('without router option', function () {
    it('should NOT add dependency', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        router: {
          "name": null,
          "version": "1.2.x",
          "module": null
        },
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.noFile('src/app/main/main.html');

        assert.fileContent(expectedGulpContent);

        assert.noFileContent([
          ['src/app/index.js', /'ngRoute'/],
          ['src/app/index.js', /'ui.router'/],
          ['bower.json', /"angular-route": "1.3.x"/],
          ['bower.json', /"angular-ui-router": "0.2.x"/],
        ]);

        done();
      });
    });
  });

  // Prompt #6: Which UI framework ?
  describe('with option: [Foundation, Node SASS]', function () {
    it('should add dependency for Foundation with SASS', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        ui: {
          "name": "foundation",
          "version": "5.4.x",
          "key": "foundation"
        },
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.scss', /\@import '..\/..\/bower_components\/foundation\/scss\/foundation';/],
          ['bower.json', /"foundation": "5.4.x"/],
          ['package.json', /"gulp-sass": "\^0.7.3"/],
        ]));

        done();
      });
    });
  });
  describe('with option: [Foundation, Ruby SASS]', function () {
    it('should add dependency for Foundation with SASS', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        ui: {
          "name": "foundation",
          "version": "5.4.x",
          "key": "foundation"
        },
        cssPreprocessor: {
          "key": "ruby-sass",
          "extension": "scss",
          "npm": {
            "gulp-ruby-sass": "^0.7.1"
          }
        }
      }));

      gulpAngular.run({}, function() {
        assert.file(expectedFile);

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.scss', /\@import '..\/..\/bower_components\/foundation\/scss\/foundation';/],
          ['bower.json', /"foundation": "5.4.x"/],
          ['package.json', /"gulp-ruby-sass": "\^0.7.1"/],
        ]));

        done();
      });
    });
  });
  describe('with option: [Foundation, LESS]', function () {
    it('should add dependency for Foundation with LESS', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        ui: {
          "name": "foundation",
          "version": "5.4.x",
          "key": "foundation"
        },
        cssPreprocessor: {
          "key": "less",
          "extension": "less",
          "npm": {
            "gulp-less": "^1.3.3"
          }
        }
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.less'
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/index.html', /<link rel="stylesheet" href="..\/bower_components\/foundation\/css\/foundation.css">/],
          ['bower.json', /"foundation": "5.4.x"/],
          ['package.json', /"gulp-less": "\^1.3.3"/],
        ]));

        done();
      });
    });
  });
  describe('with option: [Foundation, CSS]', function () {
    it('should add dependency for Foundation with CSS', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        ui: {
          "name": "foundation",
          "version": "5.4.x",
          "key": "foundation"
        },
          cssPreprocessor: {
          "key": "css",
          "extension": "css",
          "npm": {}
        }
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.css',
        ]));

        assert.noFile('src/app/vendor.*');

        // assert.fileContent([].concat(expectedGulpContent, [
        //   ['src/index.html', /<link rel="stylesheet" href="..\/bower_components\/foundation\/css\/foundation.css">/],
        //   ['bower.json', /"foundation": "5.4.x"/],
        // ]));

        // No Gulp task for style
        assert.fileContent([
          ['src/index.html', /<link rel="stylesheet" href="..\/bower_components\/foundation\/css\/foundation.css">/],
          ['bower.json', /"foundation": "5.4.x"/],
        ]);
        done();
      });
    });
  });
  describe('with option: [Bootstrap, Ruby SASS]', function () {
    it('should add dependency for Bootstrap with SASS', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        ui: {
          "name": "bootstrap-sass-official",
          "version": "3.2.x",
          "key": "bootstrap"
        },
        cssPreprocessor: {
          "key": "ruby-sass",
          "extension": "scss",
          "npm": {
            "gulp-ruby-sass": "^0.7.1"
          }
        }
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.scss',
          'src/app/vendor.scss',
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.scss', /\$icon-font-path: "\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/fonts\/bootstrap\/";/],
          ['src/app/vendor.scss', /\@import '\.\.\/\.\.\/bower_components\/bootstrap-sass-official\/assets\/stylesheets\/bootstrap';/],
          ['bower.json', /"bootstrap-sass-official": "3.2.x"/],
          ['package.json', /"gulp-ruby-sass": "\^0.7.1"/],
        ]));

        done();
      });
    });
  });
  describe('with option: [Bootstrap, LESS]', function () {
    it('should add dependency for Bootstrap with LESS', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        ui: {
          "name": "bootstrap",
          "version": "3.2.x",
          "key": "bootstrap"
        },
        cssPreprocessor: {
          "key": "less",
          "extension": "less",
          "npm": {
            "gulp-less": "^1.3.3"
          }
        }
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.less',
          'src/app/vendor.less',
        ]));

        assert.fileContent([].concat(expectedGulpContent, [
          ['src/app/vendor.less', /@import '..\/..\/bower_components\/bootstrap\/less\/bootstrap.less';/],
          ['src/app/vendor.less', /\@icon-font-path: '\/bower_components\/bootstrap\/fonts\/';/],
          ['bower.json', /"bootstrap": "3.2.x"/],
          ['package.json', /"gulp-less": "\^1.3.3"/],
        ]));

        done();
      });
    });
  });
  describe('with option: [Bootstrap, CSS]', function () {
    it('should add dependency for Bootstrap with CSS', function (done) {
      var _ = gulpAngular._;

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
        ui: {
          "name": "bootstrap",
          "version": "3.2.x",
          "key": "bootstrap"
        },
        cssPreprocessor: {
          "key": "css",
          "extension": "css",
          "npm": {}
        }
      }));

      gulpAngular.run({}, function() {
        assert.file([].concat(expectedFile, [
          'src/app/index.css',
        ]));

        assert.noFile('src/app/vendor.*');

        // assert.fileContent([].concat(expectedGulpContent, [
        //   ['src/index.html', /<link rel="stylesheet" href="..\/bower_components\/bootstrap\/dist\/css\/bootstrap.css">/],
        //   ['bower.json', /"bootstrap": "3.2.x"/],
        // ]));

        // No Gulp task for style
        assert.fileContent([
          ['src/index.html', /<link rel="stylesheet" href="..\/bower_components\/bootstrap\/dist\/css\/bootstrap.css">/],
          ['bower.json', /"bootstrap": "3.2.x"/],
        ]);

        assert.noFileContent([
          ['package.json', /"gulp-less": "\^1.3.3"/],
          ['package.json', /"gulp-sass": "\^0.7.3"/],
          ['package.json', /"gulp-ruby-sass": "\^0.7.1"/],
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

      helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default, {
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
