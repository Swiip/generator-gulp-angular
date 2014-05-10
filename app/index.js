'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var prompts = require('./prompts');

var GulpAngularGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    this.angularVersion = '1.2.x';
  },

  askForMode: function() {
    var done = this.async();

    // have Yeoman greet the user
    //this.log(this.yeoman);

    this.log(yosay('Welcome! You\'re using the fantastic generator for scaffolding an application with Angular and Gulp!'));

    this.prompt([prompts.mode], function (props) {
		  this.mode = props.mode;
      done();
    }.bind(this));
  },

  advancedMode: function() {
    if(this.mode === 'advanced') {
      var done = this.async();

      this.prompt(prompts.advanced, function (props) {
        this.props = props;
        done();
      }.bind(this));
    } else {
      this.props = {
        angularModules: [],
        jQuery: 'jqLite'
      }
    }
  },

  compileProps: function() {
    console.log('before compile', this.props)

    this.model = {};

    var angularModules = this._.chain(this.props.angularModules)
      .map(this._.dasherize)
      .map(function(module) {
        return module.replace('ng', 'angular');
      })
      .map(function(module) {
        return { name: module, version: this.angularVersion };
      }.bind(this))
      .value();

    this.model.bowerDependencies = this._.flatten([this.props.jQuery, angularModules]);

    this.model.modulesDependencies = this._.flatten(['ngRoute', this.props.angularModules]);

    console.log('after compile', this.model);
  },

  formatData: function() {
    this.bowerDependencies = this._.chain(this.model.bowerDependencies)
      .filter(this._.isObject)
      .map(function(dependency) {
        return '"' + dependency.name + '" : "' + dependency.version + '",'
      })
      .value().join('\n    ');

    this.modulesDependencies = this._.chain(this.model.modulesDependencies)
      .filter(this._.isString)
      .map(function(dependency) {
        return "'" + dependency + "'"
      })
      .value().join(', ');
  },

  app: function () {
    var files = require('./files');

    files.directories.forEach(function(directory) {
      this.mkdir(directory);
    }.bind(this));

    files.copies.forEach(function(file) {
      this.copy(file, file);
    }.bind(this));

    files.templates.forEach(function(file) {
      var basename = path.basename(file);
      var source = file.replace(basename, '_' + basename);
      this.template(source, file);
    }.bind(this));

    this.template('app/scripts/_appname.js', 'app/scripts/' + this.appname + '.js')

    files.dots.forEach(function(file) {
      this.copy(file, '.' + file);
    }.bind(this));
  },

  installs: function() {
    if (!this.options['skip-install']) {
      var done = this.async();
      this.installDependencies({ callback: done });
    }
  },

  wiredep: function() {
    //If installation is skipped, Gulp cannot be used
    if (!this.options['skip-install']) {
      var done = this.async();
      var spawned = this.spawnCommand('gulp', ['wiredep']);
      spawned.on('exit', done);
    }
  }
});

module.exports = GulpAngularGenerator;
