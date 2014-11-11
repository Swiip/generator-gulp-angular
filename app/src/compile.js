'use strict';

/* Compile choices in this.model */
module.exports = function () {

  var _ = this._;

  if (this.skipConfig) {
    this.props = this.config.get('props');
  }

  this.model = {};

  var angularModules = this.props.angularModules.map(function (module) {
    return module.module;
  });

  if(this.props.ui.key === 'bootstrap' && this.props.cssPreprocessor.extension !== 'scss') {
    this.props.ui.name = 'bootstrap';
  }

  this.model.modulesDependencies = _.flatten([
    angularModules,
    this.props.resource.module,
    this.props.router.module
  ]);

  this.model.technologies = [
    'angular', 'browsersync', 'gulp', 'jasmine', 'karma', 'protractor',
    this.props.jQuery.name,
    this.props.ui.key,
    this.props.cssPreprocessor.key
  ].filter(_.isString).filter(function(tech) {
    return tech !== 'default' && tech !== 'css';
  });

  this.model.technologies = _.reject(this.model.technologies, _.isNull);

  this.model.vendorStylesPreprocessed = !( this.props.cssPreprocessor.extension === 'css' || this.props.cssPreprocessor.extension === 'less' && this.props.ui.key === 'foundation' );
};
