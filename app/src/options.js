'use strict';

var path = require('path');

var _ = require('lodash');

var options = require('../options.json');

module.exports = function(GulpAngularGenerator) {
  
  GulpAngularGenerator.prototype.defineOptions = function defineOptions() {
    // Define options
    options.forEach(function(option) {
      this.option(option.name, {
        type: global[option.type],
        required: option.required,
        desc: option.desc,
        defaults: option.defaults
      });
    }, this);
  };

  GulpAngularGenerator.prototype.determineAppName = function determineAppName() {
    this.appName = this.appName || path.basename(process.cwd());
    this.appName = _.camelize(_.slugify(_.humanize(this.appName)));
  };

};
