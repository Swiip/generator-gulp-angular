'use strict';

var path = require('path');

/* Generate file names and copy files based on props */
module.exports = function () {
  var _ = this._;
  var copies = [];

  // Compute folder path, based on user's answer & files.json, 
  // into this.files dictionary
  var folders = require('../files.json');
  
  // Short hand variables for appPaths, the place to copy angular public files
  var appPathSource = 'src';
  var appPathDest = this.props.appPath;

  // copies is an array of a pair of source-dest path,
  // each element is an object:
  // {
  //   src: string 
  //   dest: string 
  // }
  copies = [];
  
  // Copy files defined inside files.js
  for (var name in folders) {
    var folder = folders[name];
    if (name === 'app') 
      folder.dest = appPathDest + '/';

    folder.staticFiles.forEach(function(fileDir) {
      copies.push({
        src: folder.src + fileDir,
        dest: folder.dest + fileDir
      });
    }.bind(this));

    folder.dotFiles.forEach(function(fileDir) {
      var baseName = path.basename(fileDir);
      copies.push({
        src: folder.src + fileDir,
        dest: folder.dest + fileDir.replace(baseName, '.' + baseName)
      });
    }.bind(this));

    folder.templates.forEach(function(fileDir) {
      var baseName = path.basename(fileDir);
      copies.push({
        src: folder.src + fileDir.replace(baseName, '_' + baseName),
        dest: folder.dest + fileDir,
        isTemplate: true
      });
    }.bind(this));
  }

  // Copy used techs logo
  var listTechs = require('../techs.json');

  this.usedTechs.forEach(function(value) {
    copies.push({
      src: appPathSource + '/assets/images/' + listTechs[value].logo,
      dest: appPathDest + '/assets/images/' + listTechs[value].logo
    });
  }.bind(this));

  // Copy partials relative to props.ui 
  var uiFileKey = this.props.ui.key === 'ui-bootstrap' ? 'bootstrap' : this.props.ui.key;

  copies.push({
    src: appPathSource + '/components/navbar/__' + uiFileKey + '-navbar.html',
    dest: appPathDest + '/components/navbar/navbar.html'
  });
  
  if(this.props.router.module !== null) {
    copies.push({
      src: appPathSource + '/app/main/__' + uiFileKey + '.html',
      dest: appPathDest + '/app/main/main.html'
    });
  }
  
  // Copy styles relative to props.cssPreprocessor.extension
  copies.push({
    src: appPathSource + '/app/__' + uiFileKey + '-index.' + this.props.cssPreprocessor.extension,
    dest: appPathDest + '/app/index.' + this.props.cssPreprocessor.extension
  });

  if(this.isVendorStylesPreprocessed && this.props.ui.name !== null) {
    copies.push({
      src: appPathSource + '/app/__' + uiFileKey + '-vendor.' + this.props.cssPreprocessor.extension,
      dest: appPathDest + '/app/vendor.' + this.props.cssPreprocessor.extension,
      isTemplate: true
    });
  }

  // Perform copy action
  _.forEach(copies, function(file) {
    if (file.isTemplate)
      this.template(file.src, file.dest);
    else
      this.copy(file.src, file.dest);
  }, this);
};
