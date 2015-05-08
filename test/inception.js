'use strict';

var fs = require('fs');
var path = require('path');
var spawn = require('cross-spawn');
var q = require('q');
var _ = require('lodash');
var helpers = require('yeoman-generator').test;

var outputInTest = require('./mute');
var mockOptions = require('../app/src/mock-options.js');
var mockPrompts = require('../app/src/mock-prompts.js');

var skipOptions = {
  'skip-install': true,
  'skip-welcome-message': true,
  'skip-message': true
};

var tempDir = path.join(__dirname, 'tmp/work');
var depsDir = path.join(__dirname, 'tmp/deps');

function prepare(optionCase, promptCase) {
  var options = _.extend({}, _.cloneDeep(mockOptions.defaults), optionCase, skipOptions);
  var prompts = _.extend({}, _.cloneDeep(mockPrompts.defaults), promptCase);

  return q.nfcall(helpers.testDirectory, tempDir).then(function() {
    return q.all([
      q.nfcall(fs.symlink, path.join(depsDir, 'node_modules'), path.join(tempDir, 'node_modules')),
      q.nfcall(fs.symlink, path.join(depsDir, 'bower_components'), path.join(tempDir, 'bower_components'))
    ]);
  }).then(function() {
    var gulpAngular = helpers.createGenerator(
      'gulp-angular:app',
      ['../../../app'],
      false,
      options
    );
    helpers.mockPrompt(gulpAngular, prompts);

    /*gulpAngular.on('run', outputInTest.mute);
    gulpAngular.on('end', outputInTest.unmute);*/

    return gulpAngular;
  });
}

function run(generator, task) {
  var deferred = q.defer();

  generator.conflicter.force = true;
  generator.run(function () {
    var gulpProcess = spawn('node', ['node_modules/gulp/bin/gulp.js', task], {stdio: 'inherit'});
    gulpProcess.on('exit', function(returnCode) {
      if(returnCode === 0) {
        deferred.resolve();
      } else {
        deferred.reject('Gulp returned with error code ' + returnCode);
      }
    });
  });

  return deferred.promise;
}

module.exports = {
  prepare: prepare,
  run: run
};
