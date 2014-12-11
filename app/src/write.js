'use strict';

var files = require('../files.json');
var path = require('path');

/* Process files */
module.exports = function () {
  var _ = this._;

  // Copy static files
  _.forEach(files.staticFiles, function(src) {
    this.fs.copy(this.templatePath(src),  this.destinationPath(src));
  }.bind(this));

  // Copy dot files
  _.forEach(files.dotFiles, function(src) {
    this.fs.copy(this.templatePath(src),  this.destinationPath('.' + src));
  }.bind(this));

  // Copy files formatted (format.js) with options selected in prompt
  _.forEach(this.technologiesLogoCopies, function(src) {
    this.fs.copy(this.templatePath(src),  this.destinationPath(src));
  }.bind(this));
  _.forEach(this.partialCopies, function(value, key) {
    this.fs.copy(this.templatePath(key),  this.destinationPath(value));
  }.bind(this));
  _.forEach(this.styleCopies, function(value, key) {
    this.fs.copy(this.templatePath(key),  this.destinationPath(value));
  }.bind(this));
  _.forEach(this.srcTemplates, function(value, key) {
    this.template(key, value);
  }.bind(this));
  _.forEach(this.lintConfCopies, function(src) {
    this.fs.copy(this.templatePath(src),  this.destinationPath(src));
  }.bind(this));

  // Create files with templates
  var basename;
  var src;
  _.forEach(files.templates, function(dest) {
    basename = path.basename(dest);
    src = dest.replace(basename, '_' + basename);
    this.fs.copyTpl(this.templatePath(src),  this.destinationPath(dest), this);
  }.bind(this));
};
