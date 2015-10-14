'use strict';


module.exports = function (GulpAngularGenerator) {

  /**
   * Configure routing by defining what to add in the index.html and what in the app.js
   */
  GulpAngularGenerator.prototype.computeRouter = function computeRouter() {
    var routerPartialSrc = 'src/app/main/__' + this.props.ui.key + '.html';

    if (this.props.router.key === 'angular-route') {
      this.routerHtml = '<div ng-view></div>';
      this.files.push({
        src: 'src/app/_ngroute/__ngroute.' + this.props.jsPreprocessor.srcExtension,
        dest: 'src/app/index.route.' + this.props.jsPreprocessor.extension,
        template: true
      });
    } else if (this.props.router.key === 'ui-router') {
      this.routerHtml = '<div ui-view></div>';
      this.files.push({
        src: 'src/app/_uirouter/__uirouter.' + this.props.jsPreprocessor.srcExtension,
        dest: 'src/app/index.route.' + this.props.jsPreprocessor.extension,
        template: true
      });
    } else if (this.props.router.key === 'new-router') {
      this.routerHtml = '<div ng-viewport ng-controller="RouterController"></div>';
      this.files.push({
        src: 'src/app/_newrouter/__newrouter.' + this.props.jsPreprocessor.srcExtension,
        dest: 'src/app/index.route.' + this.props.jsPreprocessor.extension,
        template: true
      });
    } else {
      this.routerHtml = this.fs.read(this.templatePath(routerPartialSrc));
      this.routerHtml = this.routerHtml.replace(
        /^<div ([^>]*)>/,
        '<div $1 ng-controller="MainController as main">'
      );

      this.routerHtml = this.routerHtml.replace(/\n/g, '\n    ');
    }
  };

};
