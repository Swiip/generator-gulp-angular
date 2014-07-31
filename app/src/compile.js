'use strict';

/* Compile choices in this.model */
module.exports = function () {
  //console.log('before compile', this.props)

  var _ = this._;

  this.model = {};

  var angularModules = this.props.angularModules.map(function (module) {
    return module.module;
  });

  var modernizr = {
    name: 'modernizr',
    version: '2.8.x'
  };

  this.model.bowerDependencies = _.flatten([
    modernizr,
    this.props.jQuery,
    this.props.angularModules,
    this.props.resource,
    this.props.router,
    this.props.ui
  ]);

  this.model.bowerResolutions = _.flatten([
    modernizr,
    this.props.jQuery
  ]);

  this.model.modulesDependencies = _.flatten([
    angularModules,
    this.props.resource.module,
    this.props.router.module
  ]);

  this.model.technologies = [
    'angular', 'browsersync', 'gulp', 'jasmine', 'karma', 'protractor',
    this.props.jQuery.name,
    this.props.ui.key
  ].filter(_.isString);

  this.props.ui.key = this.props.ui.key || 'default';

  this.model.technologies = _.reject(this.model.technologies, _.isNull);

  //console.log('compile bower', this.props, this.model.bowerDependencies);

  //Add version number of Angular for all dependencies which has no version specified
  this.model.bowerDependencies.forEach(function (dependency) {
    if (!_.isString(dependency.version)) {
      dependency.version = this.angularVersion;
    }
  }.bind(this));

  //console.log('after compile', this.model);
};
