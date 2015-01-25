'use strict';

var utils = require('./utils');

var _ = require('lodash');

function processor(data) {
  return function process(content) {
    return _.template(content.toString().replace(/\n<%([^-=])/g, '<%$1'), data);
  };
}

module.exports = function(GulpAngularGenerator) {

  GulpAngularGenerator.prototype.writeYoRc = function writeYoRc() {
    this.config.set('props', this.props);
  };

  GulpAngularGenerator.prototype.writeFiles = function writeFiles() {
    var process = processor(this);

    this.files.forEach(function(file) {
      var dest = utils.replacePrefix(file.dest, this.props.paths);
      try {
        if(file.template) {
          this.fs.copy(this.templatePath(file.src), this.destinationPath(dest), { process: process });
        } else {
          this.fs.copy(this.templatePath(file.src), this.destinationPath(dest));
        }
      } catch (error) {
        console.error('Template processing error on file', file.src);
        throw error;
      }
    }, this);
  };

  GulpAngularGenerator.prototype.install = function install() {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-message']
    });
  };

};
