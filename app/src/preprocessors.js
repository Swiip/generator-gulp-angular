'use strict';

var _ = require('lodash');

function rejectWithRegexp(regexp) {
  this.files = _.reject(this.files, function(file) {
    return regexp.test(file.src);
  });
}

module.exports = function(GulpAngularGenerator) {

  GulpAngularGenerator.prototype.computeInjectTaskDeps = function computeInjectTaskDeps() {
    // inject task dependencies computation
    this.injectTaskDeps = [];
    if (this.props.cssPreprocessor.key !== 'none') {
      this.injectTaskDeps.push('\'styles\'');
    }

    if (this.props.jsPreprocessor.key !== 'none') {
      if (this.props.jsPreprocessor.key === 'traceur') {
        this.injectTaskDeps.push('\'browserify\'');
      } else {
        this.injectTaskDeps.push('\'scripts\'');
      }
    }
  };

  GulpAngularGenerator.prototype.rejectFiles = function rejectFiles() {
      if(this.props.cssPreprocessor.key === 'none') {
        rejectWithRegexp.call(this, /styles\.js/);
      }

      if(this.props.jsPreprocessor.key === 'none') {
        rejectWithRegexp.call(this, /scripts\.js/);
      }

      if(this.props.jsPreprocessor.key !== 'typescript') {
        rejectWithRegexp.call(this, /tsd\.js/);
        rejectWithRegexp.call(this, /tsd\.json/);
      }

      if(this.props.htmlPreprocessor.key === 'none') {
        rejectWithRegexp.call(this, /markups\.js/);
      }
  };

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
