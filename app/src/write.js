'use strict';

var utils = require('./utils');

var _ = require('lodash');

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
    this.files.forEach(function(file) {
      var dest = utils.replacePrefix(file.dest, this.props.paths);
      try {
        if(file.template) {
          this.fs.copyTpl(this.templatePath(file.src), this.destinationPath(dest), this);
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
