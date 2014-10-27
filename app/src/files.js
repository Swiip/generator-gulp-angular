'use strict';

var files = require('../files.json');
var path = require('path');

/* Process files */
module.exports = function () {
  var _ = this._;
  var optionalFiles = this.optionalFiles;

  function toObject(data, type) {
    if(_.isUndefined(data)) { return {}; }
    if(!_.isArray(data)) { return data; }
    var result = {};
    data.forEach(function(element) {
      if(type === 'templates') {
        var basename = path.basename(element);
        var source = element.replace(basename, '_' + basename);
        result[source] = element;
      } else if(type === 'dots') {
        result[element] = '.' + element;
      } else {
        result[element] = element;
      }
    });
    return result;
  }

  function getFiles(type) {
    var selection = toObject(files[type], type);
    optionalFiles.forEach(function (optional) {
      if(_.isString(optional)) {
        _.extend(selection, toObject(files[optional][type], type));
      } else if(_.isArray(optional[type])) {
        _.extend(selection, toObject(optional[type], type));
      } else {
        _.extend(selection, optional[type]);
      }
    });
    //console.log('getFiles', type, 'return', selection);
    return selection;
  }

  _.each(getFiles('directories'), function(directory) {
    this.mkdir(directory);
  }.bind(this));

  _.each(getFiles('copies'), function(dest, src) {
    this.copy(src, dest);
  }.bind(this));

  _.each(getFiles('templates'), function(dest, src) {
    this.template(src, dest);
  }.bind(this));

  this.template('src/app/_appname.js', 'src/app/' + this.appname + '.js');

  _.each(getFiles('dots'), function(dest, src) {
    this.copy(src, dest);
  }.bind(this));
};
