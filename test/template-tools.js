'use strict';
/* jshint camelcase:false */

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var beautify = require('js-beautify').js_beautify;
var q = require('q');
var readdir = require('recursive-readdir');

var templatesDir = './app/templates/';
var depsDir = './test/tmp/deps/';
var compiledTemplatesDir = './test/tmp/templates/';
var compiledTemplatesSuffix = '-template.js';
var relativePathFromScriptToRoot = '../';
var sourceHeader = 'var _ = require(\'lodash\');\nmodule.exports = ';

function compile(fileName) {
  var sourceFilePath = templatesDir + fileName;
  var destinationFilePath = compiledTemplatesDir + fileName + compiledTemplatesSuffix;
  var destinationDir = path.dirname(destinationFilePath);

  return q.all([
    q.nfcall(mkdirp, destinationDir),
    q.nfcall(fs.readFile, sourceFilePath)
  ]).then(function(results) {
    var sourceContent = sourceHeader + beautify(_.template(results[1]).source, { indent_size: 2 });
    return q.nfcall(fs.writeFile, destinationFilePath, sourceContent);
  });
}

/**
 * Recompile the module but in a istanbul context, only the previous version will be instrumented
 * If the file didn't exists before, no coverage will happening
 */
function load(fileName) {
  var destinationFilePath = compiledTemplatesDir + fileName + compiledTemplatesSuffix;

  return compile(fileName)
    .then(function() {
      return require(relativePathFromScriptToRoot + destinationFilePath);
    });
}

function prepare() {
  return q.nfcall(readdir, templatesDir)
    .then(function(files) {
      return q.all(files.filter(function(file) {
        var basename = path.basename(file);
        return /^_/.test(basename);
      }).map(function(file) {
        return path.relative(templatesDir, file);
      }).map(function(file) {
        return compile(file);
      }));
    })
    .catch(function(error) {
      console.log('Prepare failed', error);
    });
}

function deps() {
  var prompts = require('../app/src/mock-prompts');
  var angularVersion = prompts.defaults.angularVersion;
  var packageFileName = 'package.json';
  var packagePath = templatesDir + '_' + packageFileName;
  var packageDestinationPath = depsDir + packageFileName;
  var bowerFileName = 'bower.json';
  var bowerPath = templatesDir + '_' + bowerFileName;
  var bowerDestinationPath = depsDir + bowerFileName;

  function processTemplate(buffer) {
    var data = {
      appName: 'appName',
      props: { angularVersion: angularVersion }
    };

    var string = buffer.toString().replace(/<%[^=].*?%>/g, '');
    return _.template(string)(data);
  }

  return q.all([
    q.nfcall(mkdirp, depsDir),
    q.nfcall(fs.readFile, packagePath),
    q.nfcall(fs.readFile, bowerPath)
  ]).then(function(results) {
    var packageFileContent = processTemplate(results[1]);
    var bowerFileContent = processTemplate(results[2]);
    return q.all([
      q.nfcall(fs.writeFile, packageDestinationPath, packageFileContent),
      q.nfcall(fs.writeFile, bowerDestinationPath, bowerFileContent)
    ]);
  })
  .catch(function(error) {
    console.log('Deps failed', error);
  });
}

module.exports = {
  compile: compile,
  load: load,
  prepare: prepare,
  deps: deps
};
