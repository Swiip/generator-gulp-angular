'use strict';

var techs = require('../techs');

/* Format this.model in template values */
module.exports = function () {
  var _ = this._;

  this.optionalFiles = [];

  function processBowerDependencies(deps) {
    return _.chain(deps)
      .filter(_.isObject)
      .filter(function (dependency) {
        return _.isString(dependency.name) && _.isString(dependency.version);
      })
      .map(function (dependency) {
        return '"' + dependency.name + '" : "' + dependency.version + '"';
      })
      .value().join(',\n    ');
  }

  this.bowerDependencies = processBowerDependencies(this.model.bowerDependencies);

  this.bowerResolutions = processBowerDependencies(this.model.bowerResolutions);

  this.wiredepExclusions = _.chain(this.model.wiredepExclusions)
    .filter(_.isString)
    .map(function (dependency) {
      return '\'' + dependency + '\'';
    })
    .value()
    .join(', ');

  this.modulesDependencies = _.chain(this.model.modulesDependencies)
    .filter(_.isString)
    .map(function (dependency) {
      return '\'' + dependency + '\'';
    })
    .value()
    .join(', ');

  this.npmDependencies = _.chain(this.model.npmDependencies)
    .keys()
    .map(function(key) {
      return ',\n    "' + key + '": "' + this.model.npmDependencies[key] + '"';
    }, this)
    .value();

  var technologiesContent = _.map(this.model.technologies, function(key) {
    return _.findWhere(techs, {key: key});
  });

  var technologiesCopies = _.map(this.model.technologies, function(key) {
    console.log('key', key);
    return 'app/images/' + _.findWhere(techs, {key: key}).logo;
  });

  this.technologies = JSON.stringify(technologiesContent, null, 2);
  this.technologies = this.technologies.replace(/"/g, '\'');
  this.technologies = this.technologies.replace(/\n/g, '\n    ');

  this.optionalFiles.push({
    copies: technologiesCopies
  });

  /* router */
  var partial = 'app/partials/__' + this.props.ui.key + '.html';

  if(this.props.router.module !== null) {
    var copies = {};
    copies[partial] = 'app/partials/main.html';
    this.optionalFiles.push({copies: copies});
    this.optionalFiles.push('router');
  }

  if (this.props.router.module === 'ngRoute') {
    this.routerHtml = '<div ng-view></div>';
    this.routerJs = this.read('app/scripts/__ngroute.js', 'utf8');
  } else if (this.props.router.module === 'ui.router') {
    this.routerHtml = '<div ui-view></div>';
    this.routerJs = this.read('app/scripts/__uirouter.js', 'utf8');
  } else {
    this.routerHtml = this.read(partial, 'utf8');
    this.routerHtml = this.routerHtml.replace(
      /^<div class="container">/,
      '<div class="container" ng-controller="MainCtrl">'
    );
    this.routerHtml = this.routerHtml.replace(/\n/g, '\n    ');
    this.routerJs = '';
  }

  /* styles */
  if(this.props.cssPreprocessor.key !== 'css') {
    this.stylesBuild = '\n' + this.read('gulp/__' + this.props.cssPreprocessor.key + '.js', 'utf8');
  } else {
    this.stylesBuild = '';
  }

  this.cssLinks = _.map(this.model.cssLinks, function(cssLink) {
    return '<link rel="stylesheet" href="' + cssLink + '">';
  }).join('\n    ');

  /* ui */
  var styleMainSource = 'app/styles/__' + this.props.ui.key + '-main.' + this.props.cssPreprocessor.extension;
  var styleMainDest = 'app/styles/main.' + this.props.cssPreprocessor.extension;
  var styleCopies = {};
  styleCopies[styleMainSource] = styleMainDest;

  if(this.model.vendorStylesPreprocessed) {
    var styleVendorSource = 'app/styles/__' + this.props.ui.key + '-vendor.' + this.props.cssPreprocessor.extension;
    var styleVendorDest = 'app/styles/vendor.' + this.props.cssPreprocessor.extension;
    styleCopies[styleVendorSource] = styleVendorDest;
  }

  this.optionalFiles.push({ copies: styleCopies });


};
