'use strict';

var _ = require('lodash');

var listTechs = require('../techs.json');

var alwaysUsedTechs = ['angular', 'browsersync', 'gulp', 'jasmine', 'karma', 'protractor'];

module.exports = function (GulpAngularGenerator) {

  /**
   * Format list techs used to generate app included in main view of sample
   */
  GulpAngularGenerator.prototype.computeTechs = function computeTechs() {
    var usedTechs = alwaysUsedTechs.concat([
      this.props.jQuery.name,
      this.props.ui.key,
      this.props.bootstrapComponents.key,
      this.props.foundationComponents.key,
      this.props.cssPreprocessor.key,
      this.props.jsPreprocessor.key,
      this.props.htmlPreprocessor.key
    ])
      .filter(_.isString)
      .filter(function (tech) {
        return listTechs[tech] !== undefined;
      });

    var techsContent = _.map(usedTechs, function (value) {
      return listTechs[value];
    });

    //TODO handle coffee version
    this.technologies = JSON.stringify(techsContent, null, 2)
      .replace(/'/g, '\\\'')
      .replace(/"/g, '\'')
      .replace(/\n/g, '\n    ');

    usedTechs.forEach(function (value) {
      var path = 'src/assets/images/' + listTechs[value].logo;

      this.files.push({
        src: path,
        dest: path,
        template: false
      });
    }, this);
  };

};
