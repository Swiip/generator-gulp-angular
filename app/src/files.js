'use strict';

var files = require('../files');
var path = require('path');

/* Process files */
module.exports = function () {
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
};
