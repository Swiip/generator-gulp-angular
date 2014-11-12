'use strict';

var techs = require('../techs.json');

/* Format this.model in template values */
module.exports = function () {
  var _ = this._;

  this.angularVersion = this.props.angularVersion;

  this.modulesDependencies = _.chain(this.model.modulesDependencies)
    .filter(_.isString)
    .map(function (dependency) {
      return '\'' + dependency + '\'';
    })
    .value()
    .join(', ');

  var technologiesContent = _.map(this.model.technologies, function(value) {
    return techs[value];
  });

  this.technologiesLogoCopies = _.map(this.model.technologies, function(value) {
    return 'src/assets/images/' + techs[value].logo;
  });

  this.technologies = JSON.stringify(technologiesContent, null, 2);
  this.technologies = this.technologies.replace(/"/g, '\'');
  this.technologies = this.technologies.replace(/\n/g, '\n    ');

  /* partial */
  this.partialCopies = {};

  var navbarPartialSrc = 'src/components/navbar/__' + this.props.ui.key + '-navbar.html';
  this.partialCopies[navbarPartialSrc] = 'src/components/navbar/navbar.html';

  var routerPartialSrc = 'src/app/main/__' + this.props.ui.key + '.html';
  if(this.props.router.module !== null) {
    this.partialCopies[routerPartialSrc] = 'src/app/main/main.html';
  }

  /* router */
  if (this.props.router.module === 'ngRoute') {
    this.routerHtml = '<div ng-view></div>';
    this.routerJs = this.read('src/app/__ngroute.js', 'utf8');
  } else if (this.props.router.module === 'ui.router') {
    this.routerHtml = '<div ui-view></div>';
    this.routerJs = this.read('src/app/__uirouter.js', 'utf8');
  } else {
    this.routerHtml = this.read(routerPartialSrc, 'utf8');
    this.routerHtml = this.routerHtml.replace(
      /^<div class="container">/,
      '<div class="container" ng-controller="MainCtrl">'
    );

    this.routerHtml = this.routerHtml.replace(/\n/g, '\n    ');
    this.routerJs = '';
  }

  /* ui */
  this.styleCopies = {};

  var styleAppSrc = 'src/app/__' + this.props.ui.key + '-index.' + this.props.cssPreprocessor.extension;
  this.styleCopies[styleAppSrc] = 'src/app/index.' + this.props.cssPreprocessor.extension;

  if(this.model.vendorStylesPreprocessed && this.props.ui.name !== null) {
    var styleVendorSource = 'src/app/__' + this.props.ui.key + '-vendor.' + this.props.cssPreprocessor.extension;
    this.styleCopies[styleVendorSource] = 'src/app/vendor.' + this.props.cssPreprocessor.extension;
  }

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
