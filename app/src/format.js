'use strict';

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

  this.modulesDependencies = _.chain(this.model.modulesDependencies)
    .filter(_.isString)
    .map(function (dependency) {
      return "'" + dependency + "'";
    })
    .value().join(', ');

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

  /* ui */
  var cssTranspiler = 'scss'; //stub

  var styleSource = 'app/styles/__' + this.props.ui.key + '.' + cssTranspiler;
  var styleDest = 'app/styles/main.' + cssTranspiler;
  var styleCopies = {};
  styleCopies[styleSource] = styleDest;

  this.optionalFiles.push({ copies: styleCopies });
};
