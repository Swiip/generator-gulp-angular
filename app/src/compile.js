'use strict';

/* Compile choices in this.model */
module.exports = function () {
  //console.log('before compile', this.props)

  this.model = {};

  var angularModules = this.props.angularModules.map(function (module) {
    return module.module;
  });

  this.model.bowerDependencies = this._.flatten([
    this.props.jQuery,
    this.props.angularModules,
    this.props.resource,
    this.props.router,
    this.props.ui
  ]);

  this.model.modulesDependencies = this._.flatten([
    angularModules,
    this.props.resource.module,
    this.props.router.module
  ]);

  console.log('compile bower', this.props, this.model.bowerDependencies);

  //Add version number of Angular for all dependencies which has no version specified
  this.model.bowerDependencies.forEach(function (dependency) {
    if (!this._.isString(dependency.version)) {
      dependency.version = this.angularVersion;
    }
  }.bind(this));

  //console.log('after compile', this.model);
};
