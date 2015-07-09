'use strict';


module.exports = function(GulpAngularGenerator) {

  /**
   * Prepare Bower overrides property to fix external bower.json with missing
   * or incomplete main property (needed by wiredep)
   */
  GulpAngularGenerator.prototype.prepareBowerOverrides = function prepareBowerOverrides() {

    var bowerOverrides = {};

    if (this.props.ui.key === 'bootstrap') {
      bowerOverrides.bootstrap = {
        main: [
          'dist/fonts/glyphicons-halflings-regular.eot',
          'dist/fonts/glyphicons-halflings-regular.svg',
          'dist/fonts/glyphicons-halflings-regular.ttf',
          'dist/fonts/glyphicons-halflings-regular.woff',
          'dist/fonts/glyphicons-halflings-regular.woff2'
        ]
      };

      if (this.props.bootstrapComponents.key === 'official') {
        bowerOverrides.bootstrap.main.unshift('dist/js/bootstrap.js');
      }

      if (this.props.cssPreprocessor.key === 'none') {
        bowerOverrides.bootstrap.main.unshift('dist/css/bootstrap.css');
      }

      if (this.props.cssPreprocessor.key === 'less') {
        bowerOverrides.bootstrap.main.unshift('less/bootstrap.less');
      }
    }

    if (bowerOverrides === {}) {
      this.bowerOverrides = null;
    } else {
      this.bowerOverrides = JSON.stringify(bowerOverrides, null, 2)
        .replace(/\n/g, '\n  ');
    }

  };

};
