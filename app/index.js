'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var prompts = require('./prompts.json');

var GulpAngularGenerator = yeoman.generators.Base.extend({

  init: function () {
    // Define the appName
    this.argument('appName', {
      type: String,
      required: false
    });
    this.appName = this.appName || path.basename(process.cwd());
    this.appName = this._.camelize(this._.slugify(this._.humanize(this.appName)));
  },

  info: function () {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay(
        chalk.red('Welcome!') + '\n' +
        chalk.yellow('You\'re using the fantastic generator for scaffolding an application with Angular and Gulp!')
      ));
    }
  },

  checkYoRc: function() {
    var cb = this.async();

    if(this.config.get('props')) {
      this.prompt([{
        type: 'confirm',
        name: 'skipConfig',
        message: 'Existing ' + chalk.green('.yo-rc') + ' configuration found, would you like to use it?',
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

    this._.findWhere(prompts, {name: 'bootstrapComponents'}).when = function(props) {
      return props.ui.key === 'bootstrap';
    };

    this.prompt(prompts, function (props) {
      if(props.ui.key !== 'bootstrap') {
        props.bootstrapComponents = {
          name: null,
          version: null,
          key: null,
          module: null
        };
      }

      this.props = props;

      done();
    }.bind(this));
  },

  saveSettings: function() {
    if (this.skipConfig) {
      return ;
    }

    this.config.set('props', this.props);
    this.config.forceSave();
  },

  // Format props to template values
  formatProps: require('./src/format'),

  // Write files (copy, template)
  writeFiles: require('./src/write'),

  // Install dependencies
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-message']
    });
  }
});

module.exports = GulpAngularGenerator;
