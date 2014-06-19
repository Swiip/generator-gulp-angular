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
        ui: { name: 'bootstrap-sass-official', version: '3.1.x', optional: 'bootstrap' }
      };
    }
  },

  /* Compile choices in this.model */
  compileProps: require('./src/compile'),

  /* Format this.model in template values */
  formatData: require('./src/format'),

  /* Process files */
  app: require('./src/files'),

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
