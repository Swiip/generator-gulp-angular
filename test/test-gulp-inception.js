/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var spawn = require('cross-spawn');
var outputInTest = require( './mute' );

var fs = require('fs');
var Q = require('q');

var chai = require('chai');
var should = require('chai').should();
var assert = require('chai').assert;
chai.use(require('chai-as-promised'));
chai.use(require('chai-fs'));

describe('gulp-angular generator', function () {
  var mockPrompts;
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
    mockPrompts = require('./mock-prompts.json');

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

  describe('with default options: [angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, jQuery 1.x.x, ngResource, ngRoute, bootstrap, node-sass]', function () {

     it('should pass gulp build', function () {
      helpers.mockPrompt(gulpAngular, mockPrompts.default);

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
      helpers.mockPrompt(gulpAngular, mockPrompts.default);

      return this.run(100000, 'test').should.be.fulfilled;
    });

    it('should pass gulp protractor', function () {
      helpers.mockPrompt(gulpAngular, mockPrompts.default);

      return this.run(100000, 'protractor').should.be.fulfilled;
    });

    it('should pass gulp protractor:dist', function () {
      helpers.mockPrompt(gulpAngular, mockPrompts.default);

      return this.run(100000, 'protractor:dist').should.be.fulfilled;
    });
  });

  describe('with other promptCase: [angular 1.2.x, jQuery 2.x.x, Restangular, UI-Router, Foundation, ruby-sass]', function () {
    var promptCase;

    before(function () {
      promptCase = gulpAngular._.assign(mockPrompts.default, {
        angularVersion: "1.2.x",
        angularModules: [],
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
          "key": "foundation"
        },
        cssPreprocessor: {
          "key": "ruby-sass",
          "extension": "scss",
          "npm": {
            "gulp-ruby-sass": "^0.7.1"
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


  describe('with other promptCase: [angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, ZeptoJS 1.1.x, $http, Bootstrap, LESS]', function () {
    var promptCase;

    before(function () {
      promptCase = gulpAngular._.assign(mockPrompts.default, {
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
          "key": "bootstrap"
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

  describe('with other promptCase: [angular 1.3.x, ngAnimate, ngCookies, ngTouch, ngSanitize, $http, Foundation, Stylus]', function () {
    var promptCase;

    before(function () {
      promptCase = gulpAngular._.assign(mockPrompts.default, {
        jQuery: {
          "name": null,
          "version": "1.1.x"
        },
        ui: {
          "name": "foundation",
          "version": "5.4.x",
          "key": "foundation"
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

});
