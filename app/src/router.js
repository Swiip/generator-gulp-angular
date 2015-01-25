'use strict';


module.exports = function(GulpAngularGenerator) {

  GulpAngularGenerator.prototype.computeRouter = function computeRouter() {
    var routerPartialSrc = 'src/app/main/__' + this.props.ui.key + '.html';

    // Compute routing relative to props.router
    if (this.props.router.module === 'ngRoute') {
      this.routerHtml = '<div ng-view></div>';
      this.routerJs = this.fs.read(this.templatePath('src/app/__ngroute.' + this.props.jsPreprocessor.extension));
    } else if (this.props.router.module === 'ui.router') {
      this.routerHtml = '<div ui-view></div>';
      this.routerJs = this.fs.read(this.templatePath('src/app/__uirouter.' + this.props.jsPreprocessor.extension));
    } else {
      this.routerHtml = this.fs.read(this.templatePath(routerPartialSrc));
      this.routerHtml = this.routerHtml.replace(
        /^<div class="container">/,
        '<div class="container" ng-controller="MainCtrl">'
      );

      this.routerHtml = this.routerHtml.replace(/\n/g, '\n    ');
      this.routerJs = '';
    }
  };

};
