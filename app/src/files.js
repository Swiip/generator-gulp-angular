'use strict';

var path = require('path');

var files = require('../files.json');

function resolvePaths(template) {
  return function(file) {
    var src = file, dest = file;

    if(template) {
      var basename = path.basename(file);
      src = file.replace(basename, '_' + basename);
    }

    if(src.match(/\.js$/)) {
      var preprocessorFile = this.sourceRoot() + '/' + src.replace(/\.js$/, '.' + this.props.jsPreprocessor.srcExtension);
      if(this.fs.exists(preprocessorFile)) {
        src = src.replace(/\.js$/, '.' + this.props.jsPreprocessor.srcExtension);
        dest = dest.replace(/\.js$/, '.' + this.props.jsPreprocessor.extension);
      }
    }

    return {
      src: src,
      dest: dest,
      template: template
    };
  };
}

module.exports = function(GulpAngularGenerator) {

  GulpAngularGenerator.prototype.prepareFiles = function prepareFiles() {

    this.files = []
      .concat(files.staticFiles.map(resolvePaths(false), this))
      .concat(files.templates.map(resolvePaths(true), this));

  };

};
