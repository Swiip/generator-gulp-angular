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
    return 'src/assets/images/' + _.findWhere(techs, {key: key}).logo;
  });

  this.technologies = JSON.stringify(technologiesContent, null, 2);
  this.technologies = this.technologies.replace(/"/g, '\'');
  this.technologies = this.technologies.replace(/\n/g, '\n    ');

  this.optionalFiles.push({
    copies: technologiesCopies
  });

  /* router */
  var partial = 'src/app/main/__' + this.props.ui.key + '.html';
  var navbar  = 'src/components/navbar/__' + this.props.ui.key + '-navbar.html';

  var copies = {};
  copies[navbar] = 'src/components/navbar/navbar.html';

  if(this.props.router.module !== null) {
    copies[partial] = 'src/app/main/main.html';
    this.optionalFiles.push('router');
  }
  this.optionalFiles.push({copies: copies});

  if (this.props.router.module === 'ngRoute') {
    this.routerHtml = '<div ng-view></div>';
    this.routerJs = this.read('src/app/__ngroute.js', 'utf8');
  } else if (this.props.router.module === 'ui.router') {
    this.routerHtml = '<div ui-view></div>';
    this.routerJs = this.read('src/app/__uirouter.js', 'utf8');
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
    this.stylesBuild = '\n' + this.read('gulp/__handleError.js', 'utf8') + '\n' +
      this.read('gulp/__' + this.props.cssPreprocessor.key + '.js', 'utf8');
  } else {
    this.stylesBuild = '';
  }

  this.cssLinks = _.map(this.model.cssLinks, function(cssLink) {
    return '<link rel="stylesheet" href="' + cssLink + '">';
  }).join('\n    ');

  this.styleExtension = this.props.cssPreprocessor.extension;

  /* ui */
  var styleAppSource = 'src/app/__' + this.props.ui.key + '-index.' + this.props.cssPreprocessor.extension;
  var styleAppDest = 'src/app/index.' + this.props.cssPreprocessor.extension;
  var styleCopies = {};
  styleCopies[styleAppSource] = styleAppDest;
  this.styleVendorPosition = '.';

  if(this.model.vendorStylesPreprocessed) {
    var styleVendorSource = 'src/app/__' + this.props.ui.key + '-vendor.' + this.props.cssPreprocessor.extension;
    var styleVendorDest = 'src/app/vendor.' + this.props.cssPreprocessor.extension;
    styleCopies[styleVendorSource] = styleVendorDest;
    this.styleVendorPosition = '{.tmp,app}';
  }

  this.optionalFiles.push({ copies: styleCopies });

  this.replaceFontPath = '';
  if(this.props.ui.key === 'bootstrap') {
    if(this.props.cssPreprocessor.extension === 'scss') {
      this.replaceFontPath = '\n    .pipe($.replace(\'bower_components/bootstrap-sass-official/assets/fonts/bootstrap\',\'fonts\'))';
    }
    if(this.props.cssPreprocessor.extension === 'less') {
      this.replaceFontPath = '\n    .pipe($.replace(\'bower_components/bootstrap/fonts\',\'fonts\'))';
    }
  }

};
