'use strict';

var utils = require('./utils');

/* Process files */
module.exports = function () {
  var _ = this._;

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
    if (key.indexOf('vendor') === -1)
      this.fs.copy(this.templatePath(key),  this.destinationPath(dest));
    else
      this.fs.copyTpl(this.templatePath(key), this.destinationPath(dest), this);
  }.bind(this));
  _.forEach(this.srcTemplates, function(value, key) {
    var dest = utils.replacePrefix(value, this.props.paths);
    this.template(key, dest);
  }.bind(this));
  _.forEach(this.lintConfCopies, function(src) {
    this.fs.copy(this.templatePath(src),  this.destinationPath(src));
  }.bind(this));
};
