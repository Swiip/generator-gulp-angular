/*global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('gulp-angular generator', function () {
  // http://stackoverflow.com/a/9804910/2857943
  // require only reads the file once, following calls return the result from cache
  delete require.cache[require.resolve('./mock-prompts.json')];
  var mockPrompts = require('./mock-prompts.json');

  var gulpAngular;
  var folderName = 'tempGulpAngular';

  var expected = [
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

    '.bowerrc',
    '.editorconfig',
    '.gitignore',
    '.jshintrc',
    '.yo-rc.json',
    'bower.json',
    'gulpfile.js',
    'package.json'
  ];

  var genOptions = {
    'skip-install': true,
    'skip-welcome-message': true,
    'skip-message': true
  };

  beforeEach(function (done) {
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

      done();
    });
  });

  // Default scenario: angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, jQuery 1.x.x, ngResource, ngRoute, bootstrap, node-sass
  it('creates expected files with default scenario', function (done) {
    helpers.mockPrompt(gulpAngular, mockPrompts.default);

    gulpAngular.run({}, function () {
      assert.file([
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
      ]);
      done();
    });
  });

  it('creates expected files with LESS', function (done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default,
      {
        cssPreprocessor: {
          "key": "less",
          "extension": "less",
          "npm": {
            "gulp-less": "^1.3.3"
          }
        }
      }
    ));

    gulpAngular.run({}, function() {
      assert.file([].concat(expected, [
        'src/app/index.less',
        'src/app/vendor.less',
      ]));
      done();
    });
  });

  it('creates expected files with CSS', function (done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default,
      {
        cssPreprocessor: {
          "key": "css",
          "extension": "css",
          "npm": {}
        }
      }
    ));

    gulpAngular.run({}, function() {
      assert.file([].concat(expected, [
        'src/app/index.css',
      ]));
      assert.noFile('src/app/vendor.*');
      done();
    });
  });

  it('creates expected files with UI Router', function (done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default,
      {
        router: {
          "name": "angular-ui-router",
          "version": "0.2.x",
          "module": "ui.router"
        }
      }
    ));

    gulpAngular.run({}, function() {
      assert.file([].concat(expected, [
        'src/app/main/main.html',
      ]));
      done();
    });
  });

  it('creates expected files without any router', function (done) {
    var _ = gulpAngular._;

    helpers.mockPrompt(gulpAngular, _.assign(mockPrompts.default,
      {
        router: {
          "name": null,
          "version": "1.3.x",
          "module": null
        }
      }
    ));

    gulpAngular.run({}, function() {
      assert.noFile('src/app/main/main.html');
      done();
    });
  });
});
