'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var prompts = require('./prompts.json');
var options = require('./options.json');
var utils = require('./src/utils.js');

var GulpAngularGenerator = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // Define arguments
    this.argument('appName', {
      type: String,
      required: false
    });

    // Define options
    options.forEach(function(option) {
      this.option(option.name, {
        type: global[option.type],
        required: option.required,
        desc: option.desc,
        defaults: option.defaults
      });
    }.bind(this));
  },

  info: function () {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay(
        chalk.red('Welcome!') + '\n' +
        chalk.yellow('You\'re using the fantastic generator for scaffolding an application with Angular and Gulp!')
      ));
    }

    if (this.options['default']) {
      var mockPrompts = require('./src/mock-prompts.js');
      var mockOptions = require('./src/mock-options.js');
      var savableOptionsDefaults = this._.filter(mockOptions.defaults, function(value, name) {
        return this._.find(options, { name: name }).save;
      }.bind(this));
      this.props = {
        paths: {
          src: mockOptions.defaults['app-path'],
          dist: mockOptions.defaults['dist-path'],
          e2e: mockOptions.defaults['e2e-path'],
          tmp: mockOptions.defaults['tmp-path']
        }
      }
      this.config.set('props', this._.merge(this.props, mockPrompts.defaults));

      this.log('__________________________');
      this.log('You use ' + chalk.green('--default') + ' option:');
      this.log('\t* angular 1.3.x\n\t* ngAnimate\n\t* ngCookies\n\t* ngTouch\n\t* ngSanitize\n\t* jQuery 1.x.x\n\t* ngResource\n\t* ngRoute\n\t* bootstrap\n\t* ui-bootstrap\n\t* node-sass');
      this.log('\n\t* --app-path=\'src\'\n\t* --dist-path=\'dist\'\n\t* --e2e-path=\'e2e\'\n\t* --tmp-path=\'.tmp\'');
      this.log('__________________________\n');
    }
  },

  checkYoRc: function() {
    var cb = this.async();

    if(this.config.get('props') && !this.options['default']) {
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

  retrieveOptions: function() {
    if (this.skipConfig || this.options['default']) {
      return;
    }

    ['app-path', 'dist-path', 'e2e-path', 'tmp-path'].forEach(function (name) {
      if (utils.isAbsolutePath(this.options[name]))
        this.env.error(name + ' must be a relative path');
      this.options[name] = utils.normalizePath(this.options[name]);
    }.bind(this));

    this.props = {
      paths: {
        src: this.options['app-path'],
        dist: this.options['dist-path'],
        e2e: this.options['e2e-path'],
        tmp: this.options['tmp-path']
      }
    }
  },

  askQuestions: function () {
    if (this.skipConfig || this.options['default']) {
      return ;
    }

    var done = this.async();

    this._.findWhere(prompts, {name: 'bootstrapComponents'}).when = function(props) {
      return props.ui.key === 'bootstrap';
    };

    this._.findWhere(prompts, {name: 'foundationComponents'}).when = function(props) {
      return props.ui.key === 'foundation';
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

      if(props.ui.key !== 'foundation') {
        props.foundationComponents = {
          name: null,
          version: null,
          key: null,
          module: null
        };
      }

      this.props = this._.merge(this.props, props);
      this.config.set('props', this.props);

      done();
    }.bind(this));
  },

  askAdvancedQuestions: function () {
    if (this.skipConfig || !this.options['advanced']) {
      return ;
    }

    var done = this.async();

    this.prompt({
      "type": "checkbox",
      "name": "advancedFeatures",
      "message": "Do you want include these features?",
      "choices": [
        {
          "value": "modernizr",
          "name": "Modernizr: the feature detection library for HTML5/CSS3",
          "checked": false
        },
        {
          "value": "imagemin",
          "name": "gulp-imagemin: minify PNG, JPEG, GIF and SVG images with imagemin",
          "checked": false
        },
        {
          "value": "qrcode",
          "name": "QRCode: display a qrcode in terminal with 'gulp serve'",
          "checked": false
        }
      ]
    }, function (props) {

      this.props.advancedFeatures = props.advancedFeatures;
      this.config.set('props', this.props);

      done();
    }.bind(this));
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
