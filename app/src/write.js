'use strict';

var chalk = require('chalk');
var utils = require('./utils');

module.exports = function (GulpAngularGenerator) {

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
    this.files.forEach(function (file) {
      var dest = utils.replacePrefix(file.dest, this.props.paths);
      try {
        if (file.template) {
          this.fs.copyTpl(this.templatePath(file.src), this.destinationPath(dest), this);
        } else {
          this.fs.copy(this.templatePath(file.src), this.destinationPath(dest));
        }
      } catch (error) {
        console.error('Template processing error on file', file.src); // eslint-disable-line no-console
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

    if (this.props.jsPreprocessor.key === 'typescript') {
      this.spawnCommandSync('tsd', ['install', '-so']);
    }
  };

  /**
   * End message
   */
  GulpAngularGenerator.prototype.end = function end() {

    this.log('It\'s time to use Gulp tasks:');
    this.log('- `$ ' + chalk.yellow.bold('gulp') + '` to build an optimized version of your application in folder ' + this.props.paths.dist);
    this.log('- `$ ' + chalk.yellow.bold('gulp serve') + '` to start BrowserSync server on your source files with live reload');
    this.log('- `$ ' + chalk.yellow.bold('gulp serve:dist') + '` to start BrowserSync server on your optimized application without live reload');
    this.log('- `$ ' + chalk.yellow.bold('gulp test') + '` to run your unit tests with Karma');
    this.log('- `$ ' + chalk.yellow.bold('gulp test:auto') + '` to run your unit tests with Karma in watch mode');
    this.log('- `$ ' + chalk.yellow.bold('gulp protractor') + '` to launch your e2e tests with Protractor');
    this.log('- `$ ' + chalk.yellow.bold('gulp protractor:dist') + '` to launch your e2e tests with Protractor on the dist files');
    this.log('\nMore details are available in docs and recipes');
    this.log('https://github.com/Swiip/generator-gulp-angular/tree/master/docs');
  };

};
