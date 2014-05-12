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
        jQuery: { name: null, version: null },
        resource: { name: null, version: null, module: null }
      }
    }
  },

  compileProps: function() {
    //console.log('before compile', this.props)

    this.model = {};

    var angularModules = this.props.angularModules.map(function(module) {
      return module.module;
    })

    this.model.bowerDependencies = this._.flatten([
      this.props.jQuery,
      this.props.angularModules,
      this.props.resource
    ]);

    this.model.modulesDependencies = this._.flatten([
      'ngRoute',
      angularModules,
      this.props.resource.module
    ]);

    this.model.bowerDependencies.forEach(function(dependency) {
      if(!this._.isString(dependency.version)) {
        dependency.version = this.angularVersion;
      }
    }.bind(this));

    //console.log('after compile', this.model);
  },

  formatData: function() {
    this.bowerDependencies = this._.chain(this.model.bowerDependencies)
      .filter(this._.isObject)
      .filter(function(dependency) {
        return this._.isString(dependency.name) && this._.isString(dependency.version);
      }.bind(this))
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
    //If installation is skipped, Gulp wiredep cannot be used
    //wiredep needs deps to be actualy here to work
    if (!this.options['skip-install']) {
      var done = this.async();
      var spawned = this.spawnCommand('gulp', ['wiredep']);
      spawned.on('exit', done);
    }
  }
});

module.exports = GulpAngularGenerator;
