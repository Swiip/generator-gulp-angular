'use strict';

var _ = require('lodash');
var chalk = require('chalk');

var prompts = require('../prompts.json');
var advancedPrompts = require('../advanced-prompts.json');

var mockPrompts = require('./mock-prompts.js');

function logChoice(prompt, prop) {
  var choice = _.findWhere(prompt.choices, {value: prop});
  this.log('\t*', choice.name);
}

module.exports = function (GulpAngularGenerator) {

  /**
   * Check Insight config
   */
  GulpAngularGenerator.prototype.checkInsight = function checkInsight() {

    if (this.insight.optOut === undefined) {
      var done = this.async();

      this.insight.track('downloaded');

      this.insight.askPermission(null, done);
    }
  };

  /**
   * Check if the default option is set, if it is, use defaults props and log them
   */
  GulpAngularGenerator.prototype.defaultOption = function defaultOption() {
    if (this.options.default) {
      this.props = _.merge(this.props, mockPrompts.defaults);

      this.log('__________________________');
      this.log('You use ' + chalk.green('--default') + ' option:');

      _.forEach(this.props, function (propOrProps, key) {
        var prompt = _.find(prompts, {name: key});
        if (_.isArray(propOrProps)) {
          propOrProps.forEach(function (prop) {
            logChoice.call(this, prompt, prop);
          }, this);
        } else {
          logChoice.call(this, prompt, propOrProps);
        }
      }, this);

      this.log('__________________________\n');
    }
  };

  /**
   * Check if there is a .yo-rc.json and ask for using it
   */
  GulpAngularGenerator.prototype.checkYoRc = function checkYoRc() {
    var done = this.async();

    if (this.config.get('props') && !this.options.default) {
      this.prompt([{
        type: 'confirm',
        name: 'skipConfig',
        message: 'Existing ' + chalk.green('.yo-rc') + ' configuration found, would you like to use it?',
        default: true
      }], function (answers) {
        this.skipConfig = answers.skipConfig;

        if (answers.skipConfig) {
          this.props = _.merge(this.props, this.config.get('props'));
        }

        done();
      }.bind(this));
    } else {
      this.skipConfig = false;
      done();
    }
  };

  /**
   * Ask all questions from prompts.json
   * Add conditional tests on those depending on first responses
   * Complete responses with null answers for questions not asked
   */
  GulpAngularGenerator.prototype.askQuestions = function askQuestions() {
    if (this.skipConfig || this.options.default) {
      return;
    }

    var done = this.async();

    _.findWhere(prompts, {name: 'bootstrapComponents'}).when = function (props) {
      return props.ui.key === 'bootstrap';
    };

    _.findWhere(prompts, {name: 'foundationComponents'}).when = function (props) {
      return props.ui.key === 'foundation';
    };

    this.prompt(prompts, function (props) {
      if (props.ui.key !== 'bootstrap') {
        props.bootstrapComponents = {
          name: null,
          version: null,
          key: null,
          module: null
        };
      }

      if (props.ui.key !== 'foundation') {
        props.foundationComponents = {
          name: null,
          version: null,
          key: null,
          module: null
        };
      }

      this.props = _.merge(this.props, props);

      done();
    }.bind(this));
  };

  /**
   * If the option is set, ask for advanced questions
   */
  GulpAngularGenerator.prototype.askAdvancedQuestions = function askAdvancedQuestions() {
    this.includeModernizr = false;
    this.imageMin = false;
    this.qrCode = false;

    if (this.skipConfig || !this.options.advanced) {
      return;
    }

    var done = this.async();

    this.prompt(advancedPrompts, function (props) {
      this.props.advancedFeatures = props.advancedFeatures;

      this.includeModernizr = this.props.advancedFeatures.indexOf('modernizr') >= 0;
      this.imageMin = this.props.advancedFeatures.indexOf('imagemin') >= 0;
      this.qrCode = this.props.advancedFeatures.indexOf('qrcode') >= 0;

      done();
    }.bind(this));
  };

  /**
   * Send anonymously report usage statistics by Insight
   */
  GulpAngularGenerator.prototype.sendInsight = function sendInsight() {
    var keyValues = [];
    _.forEach(this.props, function (aProp) {
      if (aProp.key) {
        keyValues.push(aProp.key);
      }
    });
    this.insight.track.apply(this.insight, keyValues);
  };

};
