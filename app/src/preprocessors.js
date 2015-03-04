'use strict';

var _ = require('lodash');

function rejectWithRegexp(regexp) {
  this.files = _.reject(this.files, function(file) {
    return regexp.test(file.src);
  });
}

module.exports = function(GulpAngularGenerator) {

  /**
   * List files extension processed by the generator
   */
  GulpAngularGenerator.prototype.computeProcessedFileExtension = function computeProcessedFileExtension() {
    this.processedFileExtension = [
      'html',
      'css',
      'js',
      this.props.cssPreprocessor.extension,
      this.props.jsPreprocessor.extension,
      this.props.htmlPreprocessor.extension
    ];
    if (this.imageMin) {
      this.processedFileExtension = this.processedFileExtension.concat(['jpg', 'png', 'gif', 'svg']);
    }
    this.processedFileExtension = _.chain(this.processedFileExtension)
      .uniq()
      .filter(_.isString)
      .value()
      .join(',');
  };

  /**
   * Compute gulp inject task dependencies depending on js and css preprocessors
   */
  GulpAngularGenerator.prototype.computeInjectTaskDeps = function computeInjectTaskDeps() {
    this.injectTaskDeps = [];
    if (this.props.cssPreprocessor.key !== 'none') {
      this.injectTaskDeps.push('\'styles\'');
    }

    if (this.props.jsPreprocessor.key === 'traceur') {
      this.injectTaskDeps.push('\'browserify\'');
    } else {
      this.injectTaskDeps.push('\'scripts\'');
    }
  };

  /**
   * Reject files from files.json
   * Some important files are listed in the files.json even if they are not needed
   * depending on options. This step reject these files.
   */
  GulpAngularGenerator.prototype.rejectFiles = function rejectFiles() {
      if(this.props.cssPreprocessor.key === 'none') {
        rejectWithRegexp.call(this, /styles\.js/);
      }

      if(this.props.jsPreprocessor.key !== 'typescript') {
        rejectWithRegexp.call(this, /tsd\.js/);
        rejectWithRegexp.call(this, /tsd\.json/);
      }

      if(this.props.htmlPreprocessor.key === 'none') {
        rejectWithRegexp.call(this, /markups\.js/);
      }
  };

  /**
   * Copy additional lint files if needed
   */
  GulpAngularGenerator.prototype.lintCopies = function lintCopies() {
    if(this.props.jsPreprocessor.key === 'coffee') {
      this.files.push({
        src: 'coffeelint.json',
        dest: 'coffeelint.json',
        template: false
      });
    }

    if(this.props.jsPreprocessor.key === 'typescript') {
      this.files.push({
        src: 'tslint.json',
        dest: 'tslint.json',
        template: false
      });
    }
  };

};
