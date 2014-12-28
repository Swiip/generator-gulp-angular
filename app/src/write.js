'use strict';

var utils = require('./utils');
var files = require('../files.json');
var path = require('path');

/* Process files */
module.exports = function () {
  var _ = this._;
  var data = this;

  function process(content) {
    return _.template(content.toString().replace(/\n<%/g, '<%'), data);
  }

  // Copy dot files
  _.forEach(files.dotFiles, function(src) {
    this.fs.copy(this.templatePath(src),  this.destinationPath('.' + src));
  }.bind(this));

  // Copy files formatted (format.js) with options selected in prompt
  _.forEach(this.staticFiles, function(value, key) {
    var dest = utils.replacePrefix(value, this.props.paths);
    this.fs.copy(this.templatePath(key),  this.destinationPath(dest));
  }.bind(this));
  _.forEach(this.technologiesLogoCopies, function(src) {
    var dest = utils.replacePrefix(src, this.props.paths);
    this.fs.copy(this.templatePath(src),  this.destinationPath(dest));
  }.bind(this));
  _.forEach(this.partialCopies, function(value, key) {
    var dest = utils.replacePrefix(value, this.props.paths);
    this.fs.copy(this.templatePath(key),  this.destinationPath(dest));
  }.bind(this));
  _.forEach(this.styleCopies, function(value, key) {
    var dest = utils.replacePrefix(value, this.props.paths);
    this.fs.copy(this.templatePath(key),  this.destinationPath(dest));
  }.bind(this));
  _.forEach(this.srcTemplates, function(value, key) {
    var dest = utils.replacePrefix(value, this.props.paths);
    this.fs.copy(this.templatePath(key),  this.destinationPath(dest), { process: process });
  }.bind(this));
  _.forEach(this.lintConfCopies, function(src) {
    this.fs.copy(this.templatePath(src),  this.destinationPath(src));
  }.bind(this));
};
