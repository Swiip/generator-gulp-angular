/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var spawn = require('cross-spawn');

var fs = require('fs');
var Q = require('q');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

// http://stackoverflow.com/a/9804910/2857943
// require only reads the file once, following calls return the result from cache
delete require.cache[require.resolve('./mock-prompts.json')];
var mockPrompts = require('./mock-prompts.json');

describe('gulp-angular generator', function () {
  var tempDir = path.join(__dirname, 'tempGulpAngular');
  var depsDir = path.join(__dirname, 'deps');

  var genOptions = {
    'skip-install': true,
    'skip-welcome-message': true,
    'skip-message': true
  };

  before(function () {
    this.run = function(options, timeout, task) {
      var deferred = Q.defer();

      this.timeout(timeout);

      this.app.run(options, function () {
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
    helpers.testDirectory(tempDir, function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator(
        'gulp-angular:app',
        [
          '../../app',
        ],
        false,
        genOptions
      );

      done();
    }.bind(this));
  });

  // I don't realize combination of prompts and gulp tasks
  // because it prevent me to split in different tests
  // and have precise result or be able to run only one

  it('should pass gulp build task in fast mode', function (done) {
    helpers.mockPrompt(this.app, mockPrompts.fast);
    this.run({}, 100000, 'build').should.be.fulfilled.notify(done);
  });

  it('should pass gulp test task in fast mode', function (done) {
    helpers.mockPrompt(this.app, mockPrompts.fast);
    this.run({}, 100000, 'test').should.be.fulfilled.notify(done);
  });

  it('should pass gulp test task in medium mode', function (done) {
    helpers.mockPrompt(this.app, mockPrompts.medium);
    this.run({}, 100000, 'test').should.be.fulfilled.notify(done);
  });

  it('should pass gulp test task in full mode', function (done) {
    helpers.mockPrompt(this.app, mockPrompts.full);
    this.run({}, 100000, 'test').should.be.fulfilled.notify(done);
  });

  it('should pass gulp protractor task in fast mode', function (done) {
    helpers.mockPrompt(this.app, mockPrompts.fast);
    this.run({}, 100000, 'protractor').should.be.fulfilled.notify(done);
  });

  it('should pass gulp protractor task in medium mode', function (done) {
    helpers.mockPrompt(this.app, mockPrompts.medium);
    this.run({}, 100000, 'protractor').should.be.fulfilled.notify(done);
  });

  it('should pass gulp protractor task in full mode', function (done) {
    helpers.mockPrompt(this.app, mockPrompts.full);
    this.run({}, 100000, 'protractor').should.be.fulfilled.notify(done);
  });
});
