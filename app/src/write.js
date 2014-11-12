'use strict';

var files = require('../files.json');
var path = require('path');

/* Process files */
module.exports = function () {
  var _ = this._;

  // Copy static files
  _.forEach(files.staticFiles, function(src) {
    this.copy(src);
  }.bind(this));

  // Copy dot files
  _.forEach(files.dotFiles, function(src) {
    this.copy(src, '.' + src);
  }.bind(this));

  // Copy files formatted (format.js) with options selected in prompt
  _.forEach(this.technologiesLogoCopies, function(src) {
    this.copy(src);
  }.bind(this));
  _.forEach(this.partialCopies, function(value, key) {
    this.copy(key, value);
  }.bind(this));
  _.forEach(this.styleCopies, function(value, key) {
    this.copy(key, value);
  }.bind(this));

  // Create files with templates
  var basename;
  var src;
  _.forEach(files.templates, function(dest) {
    basename = path.basename(dest);
    src = dest.replace(basename, '_' + basename);
    this.template(src, dest, this);
  }.bind(this));
};
