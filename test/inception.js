'use strict';

var fs = require('mz/fs');
var path = require('path');
var _ = require('lodash');
var spawn = require('cross-spawn');
var Promise = require('bluebird');
var helpers = require('yeoman-generator').test;

var testDirectory = Promise.promisify(helpers.testDirectory);

var mockOptions = require('../generators/app/src/mock-options.js');
var mockPrompts = require('../generators/app/src/mock-prompts.js');

var skipOptions = {
  skipInstall: true,
  skipWelcomeMessage: true,
  skipMessage: true
};

var tempDir = path.join(__dirname, 'tmp/work');
var depsDir = path.join(__dirname, 'tmp/deps');

function prepare(optionCase, promptCase) {
  var options = _.extend({}, _.cloneDeep(mockOptions.defaults), optionCase, skipOptions);
  var prompts = _.extend({}, _.cloneDeep(mockPrompts.defaults), promptCase);

  return testDirectory(tempDir).then(function () {
    return Promise.all([
      fs.symlink(path.join(depsDir, 'node_modules'), path.join(tempDir, 'node_modules')),
      fs.symlink(path.join(depsDir, 'bower_components'), path.join(tempDir, 'bower_components'))
    ]);
  }).then(function () {
    var gulpAngular = helpers.createGenerator(
      'gulp-angular:app',
      ['../../../generators/app'],
      false,
      options
    );
    helpers.mockPrompt(gulpAngular, prompts);

    return gulpAngular;
  });
}

function run(generator, task) {
  return new Promise(function (resolve, reject) {
    generator.conflicter.force = true;
    generator.run(function () {
      var gulpProcess = spawn('node', ['node_modules/gulp/bin/gulp.js', task], {stdio: 'inherit'});

      gulpProcess.on('exit', function (returnCode) {
        if (returnCode === 0) {
          resolve();
        } else {
          reject('Gulp returned with error code ' + returnCode);
        }
      });
    });
  });
}

module.exports = {
  prepare: prepare,
  run: run
};
