'use strict';

/* Compile choices in this.model */
module.exports = function () {

  var _ = this._;

  if (this.skipConfig) {
    this.props = this.config.get('props');
  }
  this.angularVersion = this.props.angularVersion;

  this.model = {};

  var angularModules = this.props.angularModules.map(function (module) {
    return module.module;
  });

  if(this.props.ui.key === 'bootstrap' &&
      this.props.cssPreprocessor.extension !== 'scss') {
    this.props.ui.name = 'bootstrap';
  }

  this.model.bowerDependencies = _.flatten([
    this.props.jQuery,
    this.props.angularModules,
    this.props.resource,
    this.props.router,
    this.props.ui
  ]);

  this.model.bowerResolutions = _.flatten([
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
    this.props.ui.key,
    this.props.cssPreprocessor.key
  ].filter(_.isString).filter(function(tech) {
    return tech !== 'default' && tech !== 'css';
  });

  this.model.technologies = _.reject(this.model.technologies, _.isNull);

  this.model.npmDependencies = _.extend({}, this.props.cssPreprocessor.npm);

  this.model.vendorStylesPreprocessed = !( this.props.cssPreprocessor.extension === 'css' ||
      this.props.cssPreprocessor.extension === 'less' && this.props.ui.key === 'foundation' );

  if(this.model.vendorStylesPreprocessed) {
    this.model.cssLinks = ['app/vendor.css'];
  } else {
    this.model.cssLinks = [];
    if(this.props.ui.key === 'bootstrap') {
      this.model.cssLinks.push('../bower_components/bootstrap/dist/css/bootstrap.css');
    } else if(this.props.ui.key === 'foundation') {
      this.model.cssLinks.push('../bower_components/foundation/css/foundation.css');
    }
  }

  //console.log('compile bower', this.props, this.model.bowerDependencies);

  //Add version number of Angular for all dependencies which has no version specified
  this.model.bowerDependencies.forEach(function (dependency) {
    if (!_.isString(dependency.version)) {
      dependency.version = this.angularVersion;
    }
  }.bind(this));

  //console.log('after compile', this.model);
};
