/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var spawn = require('cross-spawn');
var _ = require('lodash');
var outputInTest = require( './mute' );

var fs = require('fs');
var Q = require('q');

var chai = require('chai');
var should = require('chai').should();
var assert = require('chai').assert;
chai.use(require('chai-as-promised'));
chai.use(require('chai-fs'));

describe('gulp-angular generator', function () {
  var prompt = require('./mock-prompts.json');
  var promptCase;
  var gulpAngular;

  var tempDir = path.join(__dirname, 'tempGulpAngular');
  var depsDir = path.join(__dirname, 'deps');

  var tempDirDist = tempDir + '/dist';

  var genOptions = {
    'skip-install': true,
    'skip-welcome-message': true,
    'skip-message': true
  };

  before(function () {
    this.run = function(timeout, task) {
      var deferred = Q.defer();

      this.timeout(timeout);

      gulpAngular.run({}, function () {
        var promiseLinkNode = Q.nfcall(fs.symlink, path.join(depsDir, 'node_modules'), path.join(tempDir, 'node_modules'));
        var promiseLinkBower = Q.nfcall(fs.symlink, path.join(depsDir, 'bower_components'), path.join(tempDir, 'bower_components'));
        Q.all([promiseLinkNode, promiseLinkBower]).then(function() {
          var gulpProcess = spawn('node', ['node_modules/gulp/bin/gulp.js', task], {stdio: 'inherit'});
          gulpProcess.on('exit', function(returnCode) {
            if(returnCode === 0) {
              deferred.resolve();
            } else {
              deferred.reject('Gulp returned with error code ' + returnCode);
            }
          });
        }, function(error) {

          deferred.reject(error);
        });
      });

      return deferred.promise;
    };
  });

  beforeEach(function (done) {
    // http://stackoverflow.com/a/9804910/2857943
    // require only reads the file once, following calls return the result from cache
    delete require.cache[require.resolve('./mock-prompts.json')];
    prompt = require('./mock-prompts.json');

    helpers.testDirectory(tempDir, function (err) {
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

     it('should pass gulp build', function () {
      helpers.mockPrompt(gulpAngular, prompt);

      return this.run(100000, 'build').should.be.fulfilled.then(function () {
        assert.isFile(tempDirDist + '/index.html', 'File not exist');
        assert.isFile(tempDirDist + '/404.html', 'File not exist');
        assert.isFile(tempDirDist + '/favicon.ico', 'File not exist');
        assert.isDirectory(tempDirDist + '/assets', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/assets/images', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/fonts', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/scripts', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/styles', 'Directory not exist');
      });
    });

    it('should pass gulp test', function () {
      helpers.mockPrompt(gulpAngular, prompt);

      return this.run(100000, 'test').should.be.fulfilled;
    });

    it('should pass gulp protractor', function () {
      helpers.mockPrompt(gulpAngular, prompt);

      return this.run(100000, 'protractor').should.be.fulfilled;
    });

    it('should pass gulp protractor:dist', function () {
      helpers.mockPrompt(gulpAngular, prompt);

      return this.run(100000, 'protractor:dist').should.be.fulfilled;
    });
  });

  describe('with other promptCase: [angular 1.2.x, jQuery 2.x.x, Restangular, UI-Router, Foundation, CSS]', function () {

    before(function () {
      promptCase = _.assign(prompt, {
        angularVersion: "1.2.x",
        // angularModules: [],
        jQuery: {
          "name": "jquery",
          "version": "2.x.x"
        },
        resource: {
          "name": "restangular",
          "version": "1.4.x",
          "module": "restangular"
        },
        router: {
          "name": "angular-ui-router",
          "version": "0.2.x",
          "module": "ui.router"
        },
        ui: {
          "name": "foundation",
          "version": "5.4.x",
          "key": "foundation",
          "module": null
        },
        cssPreprocessor: {
          "key": "css",
          "extension": "css",
          "npm": {}
        }
      });
    });

    it('should pass gulp build', function () {

      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'build').should.be.fulfilled.then(function () {
        assert.isFile(tempDirDist + '/index.html', 'File not exist');
        assert.isFile(tempDirDist + '/404.html', 'File not exist');
        assert.isFile(tempDirDist + '/favicon.ico', 'File not exist');
        assert.isDirectory(tempDirDist + '/assets', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/assets/images', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/scripts', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/styles', 'Directory not exist');
      });
    });

    it('should pass gulp test', function () {
      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'test').should.be.fulfilled;
    });

    it('should pass gulp protractor', function () {
      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'protractor').should.be.fulfilled;
    });

    it('should pass gulp protractor:dist', function () {
      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'protractor:dist').should.be.fulfilled;
    });
  });

  describe('with other promptCase: [angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, ZeptoJS 1.1.x, $http, Bootstrap, LESS]', function () {

    before(function () {
      promptCase = _.assign(prompt, {
        jQuery: {
          "name": "zeptojs",
          "version": "1.1.x"
        },
        resource: {
          "name": null,
          "version": "1.2.x",
          "module": null
        },
        router: {
          "name": null,
          "version": "1.2.x",
          "module": null
        },
        ui: {
          "name": "bootstrap",
          "version": "3.2.x",
          "key": "bootstrap",
          "module": null
        },
        bootstrapComponents: {
          "name": "angular-bootstrap",
          "version": "0.12.x",
          "key": "ui-bootstrap",
          "module": "ui.bootstrap"
        },
        cssPreprocessor: {
          "key": "less",
          "extension": "less",
          "npm": {
            "gulp-less": "^1.3.3"
          }
        }
      });
    });

    it('should pass gulp build', function () {

      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'build').should.be.fulfilled.then(function () {
        assert.isFile(tempDirDist + '/index.html', 'File not exist');
        assert.isFile(tempDirDist + '/404.html', 'File not exist');
        assert.isFile(tempDirDist + '/favicon.ico', 'File not exist');
        assert.isDirectory(tempDirDist + '/assets', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/assets/images', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/fonts', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/scripts', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/styles', 'Directory not exist');
      });
    });

    it('should pass gulp test', function () {
      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'test').should.be.fulfilled;
    });

    it('should pass gulp protractor', function () {
      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'protractor').should.be.fulfilled;
    });

    it('should pass gulp protractor:dist', function () {
      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'protractor:dist').should.be.fulfilled;
    });
  });

  describe('with other promptCase: [angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, $http, ngMaterial, Stylus]', function () {

    before(function () {
      promptCase = _.assign(prompt, {
        jQuery: {
          "name": null,
          "version": "1.1.x"
        },
        ui: {
          "name": "angular-material",
          "version": "0.5.x",
          "key": "angular-material",
          "module": "ngMaterial"
        },
        cssPreprocessor: {
          "key": "stylus",
          "extension": "styl",
          "npm": {
            "gulp-stylus": "^1.3.3"
          }
        }
      });
    });

    it('should pass gulp build', function () {

      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'build').should.be.fulfilled.then(function () {
        assert.isFile(tempDirDist + '/index.html', 'File not exist');
        assert.isFile(tempDirDist + '/404.html', 'File not exist');
        assert.isFile(tempDirDist + '/favicon.ico', 'File not exist');
        assert.isDirectory(tempDirDist + '/assets', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/assets/images', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/scripts', 'Directory not exist');
        assert.isDirectory(tempDirDist + '/styles', 'Directory not exist');
      });
    });

    it('should pass gulp test', function () {
      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'test').should.be.fulfilled;
    });

    it('should pass gulp protractor', function () {
      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'protractor').should.be.fulfilled;
    });

    it('should pass gulp protractor:dist', function () {
      helpers.mockPrompt(gulpAngular, promptCase);

      return this.run(100000, 'protractor:dist').should.be.fulfilled;
    });
  });
});
