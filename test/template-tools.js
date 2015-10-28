/*eslint no-console: 0*/
'use strict';

var fs = require('mz/fs');
var Promise = require('bluebird');
var path = require('path');
var mkdirp = Promise.promisify(require('mkdirp'));
var beautify = require('js-beautify').js_beautify;
var readdir = Promise.promisify(require('recursive-readdir'));
var ejs = require('ejs');

var templatesDir = path.join(__dirname, '../generators/app/templates/');
var depsDir = path.join(__dirname, 'tmp/deps/');
var compiledTemplatesDir = path.join(__dirname, 'tmp/templates/');
var compiledTemplatesSuffix = '-template.js';
var sourceHeader = 'module.exports = function(locals) {\n';
var sourceFooter = '\n};';

/**
 * That's not a code I'm very proud of.
 * But it's the only way I found to get the same feature for EJS I had with lodash
 * for getting the compiled JS code for the template
 */
function compileEjs(content) {
  var savedConsoleLog = console.log;
  var source;

  console.log = function (src) {
    source = src;
  };

  ejs.compile(content, { debug: true, compileDebug: false });

  console.log = savedConsoleLog;

  return source;
}

function compile(fileName) {
  var sourceFilePath = templatesDir + fileName;
  var destinationFilePath = compiledTemplatesDir + fileName + compiledTemplatesSuffix;
  var destinationDir = path.dirname(destinationFilePath);

  return Promise.all([
    mkdirp(destinationDir),
    fs.readFile(sourceFilePath)
  ]).then(function (results) {
    var content = results[1].toString();
    var sourceContent = sourceHeader + beautify(compileEjs(content), { indent_size: 2 }) + sourceFooter; // eslint-disable-line camelcase
    sourceContent = sourceContent.replace('with(locals || {})', 'with(locals)');
    return fs.writeFile(destinationFilePath, sourceContent);
  });
}

/**
 * Recompile the module but in an istanbul context, only the previous version will be instrumented
 * If the file didn't exists before, no coverage will happening
 */
function load(fileName) {
  var destinationFilePath = path.join(compiledTemplatesDir, fileName + compiledTemplatesSuffix);

  return compile(fileName)
    .then(function () {
      return require(destinationFilePath);
    });
}

function prepare() {
  return readdir(templatesDir)
    .then(function (files) {
      return Promise.all(files.filter(function (file) {
        var basename = path.basename(file);
        return /^_[^_]/.test(basename);
      }).map(function (file) {
        return path.relative(templatesDir, file);
      }).map(function (file) {
        return compile(file);
      }));
    })
    .catch(function (error) {
      console.log('Prepare failed', error);
    });
}

function deps() {
  var prompts = require('../generators/app/src/mock-prompts');
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
      props: { angularVersion: angularVersion },
      bowerOverrides: '{}'
    };

    var string = buffer.toString().replace(/<%[^-].*?%>/g, '');
    string = string.replace(/"gulp-imagemin".*/, '');
    return ejs.render(string, data);
  }

  return Promise.all([
    mkdirp(depsDir),
    fs.readFile(packagePath),
    fs.readFile(bowerPath)
  ]).then(function (results) {
    var packageFileContent = processTemplate(results[1]);
    var bowerFileContent = processTemplate(results[2]);
    return Promise.all([
      fs.writeFile(packageDestinationPath, packageFileContent),
      fs.writeFile(bowerDestinationPath, bowerFileContent)
    ]);
  })
  .catch(function (error) {
    console.log('Deps failed', error);
  });
}

module.exports = {
  compile: compile,
  load: load,
  prepare: prepare,
  deps: deps
};
