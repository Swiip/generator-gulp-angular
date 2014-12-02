'use strict';

var path = require('path');

/* Generate global template variables from props */
module.exports = function () {
  var _ = this._;

  // Retrieve props stored in .yo-rc.json
  if (this.skipConfig) {
    this.props = this.config.get('props');
  }

  var appPathSource = 'src';

  // Compute relative path from appPath to bower_components
  this.appToBower = path.relative(this.props.appPath, '');

  // Format list ngModules included in AngularJS DI
  var ngModules = this.props.angularModules.map(function (module) {
    return module.module;
  });

  ngModules = _.flatten([
    ngModules,
    this.props.resource.module,
    this.props.router.module,
    this.props.ui.module,
    this.props.bootstrapComponents.module
  ]);

  this.modulesDependencies = _.chain(ngModules)
    .filter(_.isString)
    .map(function (dependency) {
      return '\'' + dependency + '\'';
    })
    .valueOf()
    .join(', ');

  // Format list techs used to generate app included in main view of sample
  var listTechs = require('../techs.json');
  
  this.usedTechs = [
    'angular', 'browsersync', 'gulp', 'jasmine', 'karma', 'protractor',
    this.props.jQuery.name,
    this.props.ui.key,
    this.props.bootstrapComponents.key,
    this.props.cssPreprocessor.key
  ]
    .filter(_.isString)
    .filter(function(tech) {
      return tech !== 'default' && tech !== 'css' && tech !== 'official' && tech !== 'none';
    });

  var techsContent = _.map(this.usedTechs, function(value) {
    return listTechs[value];
  });

  this.technologies = JSON.stringify(techsContent, null, 2)
    .replace(/'/g, '\\\'')
    .replace(/"/g, '\'')
    .replace(/\n/g, '\n    ');

  // Compute routing relative to props.router
  var uiFileKey = this.props.ui.key === 'ui-bootstrap' ? 'bootstrap' : this.props.ui.key;
  
  if (this.props.router.module === 'ngRoute') {
    this.routerHtml = '</*div*/ ng-view></div>';
    this.routerJs = this.read(appPathSource + '/app/__ngroute.js', 'utf8');
  } else if (this.props.router.module === 'ui.router') {
    this.routerHtml = '<div ui-view></div>';
    this.routerJs = this.read(appPathSource + '/app/__uirouter.js', 'utf8');
  } else {
    this.routerHtml = this.read(appPathSource + '/app/main/__' + uiFileKey + '.html', 'utf8');
    this.routerHtml = this.routerHtml.replace(
      /^<div class="container">/,
      '<div class="container" ng-controller="MainCtrl">'
    );

    this.routerHtml = this.routerHtml.replace(/\n/g, '\n    ');
    this.routerJs = '';
  }

  // Wiredep exclusions
  this.wiredepExclusions = [];
  if(this.props.bootstrapComponents.key !== 'official') {
    if(this.props.cssPreprocessor.extension === 'scss') {
      this.wiredepExclusions.push('/bootstrap-sass-official/');
    } else {
      this.wiredepExclusions.push('/bootstrap.js/');
    }
  }
  if(this.props.cssPreprocessor.key !== 'css') {
    this.wiredepExclusions.push('/bootstrap.css/');
  }

  // Format choice UI Framework
  if(this.props.ui.key.indexOf('bootstrap') !== -1 && this.props.cssPreprocessor.extension !== 'scss') {
    this.props.ui.name = 'bootstrap';
  }

  // There is 2 ways of dealing with vendor styles
  // - If the vendor styles exist in the css preprocessor chosen,
  //   the best is to include directly the source files
  // - If not, the vendor styles are simply added as standard css links
  //
  // isVendorStylesPreprocessed defines which solution has to be used
  // regarding the ui framework and the css preprocessor chosen.
  this.isVendorStylesPreprocessed = false;

  if(this.props.cssPreprocessor.extension === 'scss') {
    if(this.props.ui.key === 'bootstrap' || this.props.ui.key === 'foundation') {
      this.isVendorStylesPreprocessed = true;
    }
  } else if(this.props.cssPreprocessor.extension === 'less') {
    if(this.props.ui.key === 'bootstrap') {
      this.isVendorStylesPreprocessed = true;
    }
  }
};
