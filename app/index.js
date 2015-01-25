'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var GulpAngularGenerator = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // Define arguments
    this.argument('appName', {
      type: String,
      required: false
    });

    this.props = {};
  },

  info: function () {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay(
        chalk.red('Welcome!') + '\n' +
        chalk.yellow('You\'re using the fantastic generator for scaffolding an application with Angular and Gulp!')
      ));
    }
  }

});

require('./src/options')(GulpAngularGenerator);
require('./src/prompts')(GulpAngularGenerator);
require('./src/paths')(GulpAngularGenerator);
require('./src/files')(GulpAngularGenerator);

require('./src/modules')(GulpAngularGenerator);
require('./src/techs')(GulpAngularGenerator);
require('./src/ui')(GulpAngularGenerator);
require('./src/router')(GulpAngularGenerator);
require('./src/preprocessors')(GulpAngularGenerator);

require('./src/write')(GulpAngularGenerator);

module.exports = GulpAngularGenerator;
