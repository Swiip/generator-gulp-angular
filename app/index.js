'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var prompts = require('./prompts');

var GulpAngularGenerator = yeoman.generators.Base.extend({
  /* Initialization, evaluate appname */
  init: function () {
    this.pkg = require('../package.json');

    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    this.angularVersion = '1.2.x';
  },

  /* Welcome, prompt fast or advanced */
  askForMode: function () {
    var done = this.async();

    this.log(yosay('Welcome! You\'re using the fantastic generator for scaffolding an application with Angular and Gulp!'));

    this.prompt([prompts.mode], function (props) {
		  this.mode = props.mode;
      done();
    }.bind(this));
  },

  /* Handle advanced prompts or set default values */
  advancedMode: function () {
    if (this.mode === 'advanced') {
      var done = this.async();

      this.prompt(prompts.advanced, function (props) {
        this.props = props;
        done();
      }.bind(this));
    } else {
      this.props = {
        angularModules: [],
        jQuery: { name: null, version: null },
        resource: { name: null, version: null, module: null },
        router: { name: null, version: null, module: null },
        ui: { name: 'bootstrap-sass-official', version: '3.1.x' }
      };
    }
  },

  /* Compile choices in this.model */
  compileProps: function () {
    //console.log('before compile', this.props)

    this.model = {};

    var angularModules = this.props.angularModules.map(function (module) {
      return module.module;
    });

    this.model.bowerDependencies = this._.flatten([
      this.props.jQuery,
      this.props.angularModules,
      this.props.resource,
      this.props.router
    ]);

    this.model.modulesDependencies = this._.flatten([
      angularModules,
      this.props.resource.module,
      this.props.router.module
    ]);

    //Add version number of Angular for all dependencies which has no version specified
    this.model.bowerDependencies.forEach(function (dependency) {
      if (!this._.isString(dependency.version)) {
        dependency.version = this.angularVersion;
      }
    }.bind(this));

    //console.log('after compile', this.model);
  },

  /* Format this.model in template values */
  formatData: function () {
    this.optionalFiles = [];

    this.bowerDependencies = this._.chain(this.model.bowerDependencies)
      .filter(this._.isObject)
      .filter(function (dependency) {
        return this._.isString(dependency.name) && this._.isString(dependency.version);
      }.bind(this))
      .map(function (dependency) {
        return '"' + dependency.name + '" : "' + dependency.version + '",';
      })
      .value().join('\n    ');

    this.modulesDependencies = this._.chain(this.model.modulesDependencies)
      .filter(this._.isString)
      .map(function (dependency) {
        return "'" + dependency + "'";
      })
      .value().join(', ');

    if (this.props.router.module === 'ngRoute') {
      this.routerHtml = '<div ng-view></div>';
      this.routerJs = this.read('app/scripts/__ngroute.js', 'utf8');
      this.optionalFiles.push('router');
    } else if (this.props.router.module === 'ui.router') {
      this.routerHtml = '<div ui-view></div>';
      this.routerJs = this.read('app/scripts/__uirouter.js', 'utf8');
      this.optionalFiles.push('router');
    } else {
      this.routerHtml = this.read('app/partials/main.html', 'utf8');
      this.routerHtml = this.routerHtml.replace(
        /^<div class="container">/,
        '<div class="container" ng-controller="MainCtrl">'
      );
      this.routerHtml = this.routerHtml.replace(/\n/g, '\n    ');
      this.routerJs = '';
    }
  },

  /* Process files */
  app: function () {
    var files = require('./files');

    var getFiles = function (type) {
      var selection = files[type];
      this.optionalFiles.forEach(function (optional) {
        if (this._.isArray(files[optional][type])) {
          selection = selection.concat(files[optional][type]);
        }
      }.bind(this));
      return selection;
    }.bind(this);

    getFiles('directories').forEach(function (directory) {
      this.mkdir(directory);
    }.bind(this));

    getFiles('copies').forEach(function (file) {
      this.copy(file, file);
    }.bind(this));

    getFiles('templates').forEach(function (file) {
      var basename = path.basename(file);
      var source = file.replace(basename, '_' + basename);
      this.template(source, file);
    }.bind(this));

    this.template('app/scripts/_appname.js', 'app/scripts/' + this.appname + '.js');

    getFiles('dots').forEach(function (file) {
      this.copy(file, '.' + file);
    }.bind(this));
  },

  /* Install dependencies */
  installs: function () {
    if (!this.options['skip-install']) {
      var done = this.async();
      this.installDependencies({ callback: done });
    }
  },

  /* Launch gulp-wiredep task */
  wiredep: function () {
    //If installation is skipped, Gulp wiredep cannot be used
    //wiredep needs deps to be actualy there to work
    if (!this.options['skip-install']) {
      var done = this.async();
      var spawned = this.spawnCommand('gulp', ['wiredep']);
      spawned.on('exit', done);
    }
  }
});

module.exports = GulpAngularGenerator;
