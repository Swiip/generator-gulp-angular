'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var GulpAngularGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    //var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic GulpAngular generator.'));

    /*var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      done();
    }.bind(this));*/
  },

  app: function () {
    var files = require('./files')

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
  }
});

module.exports = GulpAngularGenerator;
