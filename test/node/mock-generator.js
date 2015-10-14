'use strict';

require('yeoman-generator');
var _ = require('lodash');

module.exports = function () {
  this._ = _;
  this.log = function () {};
  this.async = function () {
    return function () {};
  };
  this.options = {};
  this.config = {
    get: function () {},
    set: function () {}
  };
  this.env = {
    error: function () {}
  };
  this.fs = {
    exists: function () {},
    read: function () {},
    copy: function () {},
    copyTpl: function () {}
  };
  this.prompt = function () {};
  this.props = {};
  this.sourceRoot = function () {
    return '';
  };
  this.option = function () {};
  this.templatePath = function (path) {
    return 'template/' + path;
  };
  this.destinationPath = function (path) {
    return 'destination/' + path;
  };
  this.installDependencies = function () {};
};
