'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var prompts = require('./prompts.json');

var GulpAngularGenerator = yeoman.generators.Base.extend({
  /* Initialization, evaluate appname */
  init: function () {
    this.pkg = require('../package.json');

    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));
  },

  info: function () {
    this.log(yosay(
      chalk.red('Welcome!') + '\n' +
      chalk.yellow('You\'re using the fantastic generator for scaffolding an application with Angular and Gulp!')
    ));
  },

  checkYoRc: function() {
    var cb = this.async();

    if(this.config.get('props')) {
      this.prompt([{
        type: "confirm",
        name: "skipConfig",
        message: "Existing " + chalk.green('.yo-rc') + " configuration found, would you like to use it?",
        default: true,
      }], function (answers) {
        this.skipConfig = answers.skipConfig;

        cb();
      }.bind(this));
    } else {
      cb();
    }
  },

  askQuestions: function () {
    if (this.skipConfig) {
      return ;
    }

    var done = this.async();

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));

  },

  saveSettings: function() {
    if (this.skipConfig) {
      return ;
    }

    this.config.set('props', this.props);
    this.config.save();
  },

  /* Compile choices in this.model */
  compileProps: require('./src/compile'),

  /* Format this.model in template values */
  formatData: require('./src/format'),

  /* Process files */
  app: require('./src/files'),

  /* Install dependencies */
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});

module.exports = GulpAngularGenerator;
