'use strict';

var utils = require('./utils');

var _ = require('lodash');

/**
 * Process content with data with _.template
 * Add a home made preprocessing which removes lines where there is only a
 * template instruction
 */
function processor(data) {
  return function process(content) {
    return _.template(content.toString().replace(/\n<%([^-=])/g, '<%$1'), data);
  };
}

module.exports = function(GulpAngularGenerator) {

  /**
   * Write computed props in the .yo-rc.json
   */
  GulpAngularGenerator.prototype.writeYoRc = function writeYoRc() {
    this.config.set('version', this.version);
    this.config.set('props', this.props);
  };

  /**
   * Pass through each files and actually copy them
   */
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

  /**
   * Launch npm and bower installs unless they are skipped
   */
  GulpAngularGenerator.prototype.install = function install() {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-message']
    });
  };

};
