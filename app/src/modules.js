'use strict';

var _ = require('lodash');

module.exports = function(GulpAngularGenerator) {

  GulpAngularGenerator.prototype.computeModules = function computeModules() {

    // Format list ngModules included in AngularJS DI
    var ngModules = this.props.angularModules.map(function (module) {
      return module.module;
    });

    ngModules = ngModules.concat([
      this.props.resource.module,
      this.props.router.module,
      this.props.ui.module,
      this.props.bootstrapComponents.module,
      this.props.foundationComponents.module
    ]);

    this.modulesDependencies = ngModules
      .filter(_.isString)
      .map(function (dependency) {
        return '\'' + dependency + '\'';
      })
      .join(', ');
  };

};
