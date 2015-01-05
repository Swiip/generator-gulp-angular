'use strict';

var utils = require('./utils');
var files = require('../files.json');

/* Process files */
module.exports = function () {
  var _ = this._;
  var data = this;

  function process(content) {
    return _.template(content.toString().replace(/\n<%/g, '<%'), data);
  }

  var copy = function copy(src, dest, processing) {
    dest = utils.replacePrefix(dest, this.props.paths);
    try {
      if(processing) {
        this.fs.copy(this.templatePath(src), this.destinationPath(dest), { process: process });
      } else {
        this.fs.copy(this.templatePath(src), this.destinationPath(dest));
      }
    } catch (error) {
      console.error('Template processing error on file', src);
      throw error;
    }
  }.bind(this);

  // Copy dot files
  _.forEach(files.dotFiles, function(src) {
    copy(src, '.' + src);
  });

  // Copy files formatted (format.js) with options selected in prompt
  _.forEach(this.staticFiles, function(dest, src) {
    copy(src, dest);
  });

  _.forEach(this.technologiesLogoCopies, function(src) {
    copy(src, src);
  });
  _.forEach(this.partialCopies, function(dest, src) {
    copy(src, dest);
  });
  _.forEach(this.styleCopies, function(dest, src) {
    copy(src, dest, true);
  });
  _.forEach(this.srcTemplates, function(dest, src) {
    copy(src, dest, true);
  });
  _.forEach(this.lintConfCopies, function(src) {
    copy(src, src);
  });
};
