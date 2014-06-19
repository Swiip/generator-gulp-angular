'use strict';

/* Format this.model in template values */
module.exports = function () {
  this.optionalFiles = [];

  this.bowerDependencies = this._.chain(this.model.bowerDependencies)
    .filter(this._.isObject)
    .filter(function (dependency) {
      return this._.isString(dependency.name) && this._.isString(dependency.version);
    }.bind(this))
    .map(function (dependency) {
      return '"' + dependency.name + '" : "' + dependency.version + '"';
    })
    .value().join(',\n    ');

  this.modulesDependencies = this._.chain(this.model.modulesDependencies)
    .filter(this._.isString)
    .map(function (dependency) {
      return "'" + dependency + "'";
    })
    .value().join(', ');

  /* router */
  var partial = 'app/partials/__' + this.props.ui.optional + '.html';

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
  console.log('ui optional', this.props.ui);

  var cssTranspiler = 'sass'; //stub

  this.optionalFiles.push(this.props.ui.optional + '-' + cssTranspiler);
};
