'use strict';

var path = require('path');

module.exports = function () {
  var _ = this._;

  // Retrieve props stored in .yo-rc.json
  if (this.skipConfig) {
    this.props = this.config.get('props');
  }

  // Compute folder path, based on user's answer & files.json, 
  // into this.files dictionary
  var files = require('../files.json');
  this.copies = [];
  
  // Short hand variables for appPath, the place to copy angular public files
  var appPathSource = 'src';              // as in templates/src, where to copy from
  var appPathDest = this.props.appPath;   // as answered by user, where to copy to

  // copies: 
  // a dictionary of key-value, with key being folder name, 
  // value contains its data 
  // 
  // copies
  //   app
  //     src
  //     dest
  //     templates: defined in files.js, or below
  //     static: defined in files.js
  //     dotfiles: defined in files.js
  //   root
  //     src
  //     dest
  //     templates:  
  //     static: 
  //     dotfiles: 
  this.files = files;
  for (var key in this.files) {
    folder = this.files[key];
    if (key === 'app') 
      folder.dest = appPathDest;

    folder.staticFiles.forEach(function(fileDir) {
      this.copies.push({
        src: folder.src + fileDir,
        dest: folder.dest + fileDir
      });
    }.bind(this));

    folder.dotFiles.forEach(function(fileDir) {
      var baseName = path.basename(fileDir);
      this.copies.push({
        src: folder.src + fileDir,
        dest: folder.dest + fileDir.replace(baseName, '.' + baseName)
      });
    }.bind(this));

    folder.templates.forEach(function(fileDir) {
      var baseName = path.basename(fileDir);
      this.copies.push({
        src: folder.src + fileDir.replace(baseName, '_' + baseName),
        dest: folder.dest + fileDir
      });
    }.bind(this));
  }

  // Format list ngModules included in AngularJS DI
  var ngModules = this.props.angularModules.map(function (module) {
    return module.module;
  });

  ngModules = _.flatten([
    ngModules,
    this.props.resource.module,
    this.props.router.module,
    this.props.ui.module,
    this.props.bootstrapComponents.module
  ]);

  this.modulesDependencies = _.chain(ngModules)
    .filter(_.isString)
    .map(function (dependency) {
      return '\'' + dependency + '\'';
    })
    .valueOf()
    .join(', ');

  // Format list techs used to generate app included in main view of sample
  var listTechs = require('../techs.json');
  
  var usedTechs = [
    'angular', 'browsersync', 'gulp', 'jasmine', 'karma', 'protractor',
    this.props.jQuery.name,
    this.props.ui.key,
    this.props.bootstrapComponents.key,
    this.props.cssPreprocessor.key
  ]
    .filter(_.isString)
    .filter(function(tech) {
      return tech !== 'default' && tech !== 'css' && tech !== 'official' && tech !== 'none';
    });

  var techsContent = _.map(usedTechs, function(value) {
    return listTechs[value];
  });

  this.technologies = JSON.stringify(techsContent, null, 2)
    .replace(/'/g, '\\\'')
    .replace(/"/g, '\'')
    .replace(/\n/g, '\n    ');
  // this.technologiesLogoCopies = _.map(usedTechs, function(value) {
  //   return {
  //     'src/assets/images/' + listTechs[value].logo;
  // });
  usedTechs.angular.forEach(tech, function(usedTech) {
    return {
      src: appPathSource + '/assets/images/' + listTechs(value).logo,
      dest: appPathDest + '/assets/images/' + listTechs(value).logo
    }
  });

  // Select partials relative to props.ui
  var uiFileKey = this.props.ui.key === 'ui-bootstrap' ? 'bootstrap' : this.props.ui.key;

  this.partialCopies = {};

  // var navbarPartialSrc = 'src/components/navbar/__' + uiFileKey + '-navbar.html';
  // this.partialCopies[navbarPartialSrc] = 'src/components/navbar/navbar.html';
  this.copies.push({
    src: appPathSource + '/components/navbar/__' + uiFileKey + '-navbar.html',
    dest: appPathDest + '/components/navbar/navbar.html'
  });

  var routerPartialSrc = 'src/app/main/__' + uiFileKey + '.html';
  if(this.props.router.module !== null) {
    // this.partialCopies[routerPartialSrc] = 'src/app/main/main.html';
    this.copies.push({
      src: appPathSource + '/app/main/__' + uiFileKey + '.html',
      dest: appPathDest + '/app/main/main.html'
    });
  }

  // Compute routing relative to props.router
  if (this.props.router.module === 'ngRoute') {
    this.routerHtml = '</*div*/ ng-view></div>';
    this.routerJs = this.read(appPathSource + '/app/__ngroute.js', 'utf8');
  } else if (this.props.router.module === 'ui.router') {
    this.routerHtml = '<div ui-view></div>';
    this.routerJs = this.read(appPathSource + '/app/__uirouter.js', 'utf8');
  } else {
    this.routerHtml = this.read(routerPartialSrc, 'utf8');
    this.routerHtml = this.routerHtml.replace(
      /^<div class="container">/,
      '<div class="container" ng-controller="MainCtrl">'
    );

    this.routerHtml = this.routerHtml.replace(/\n/g, '\n    ');
    this.routerJs = '';
  }

  // Wiredep exclusions
  this.wiredepExclusions = [];
  if(this.props.bootstrapComponents.key !== 'official') {
    if(this.props.cssPreprocessor.extension === 'scss') {
      this.wiredepExclusions.push('/bootstrap-sass-official/');
    } else {
      this.wiredepExclusions.push('/bootstrap.js/');
    }
  }
  if(this.props.cssPreprocessor.key !== 'css') {
    this.wiredepExclusions.push('/bootstrap.css/');
  }

  // Format choice UI Framework
  if(this.props.ui.key.indexOf('bootstrap') !== -1 && this.props.cssPreprocessor.extension !== 'scss') {
    this.props.ui.name = 'bootstrap';
  }

  this.styleCopies = {};

  // var styleAppSrc = 'src/app/__' + uiFileKey + '-index.' + this.props.cssPreprocessor.extension;
  // this.styleCopies[styleAppSrc] = appPath + '/app/index.' + this.props.cssPreprocessor.extension;
  this.copies.push({
    src: appPathSource + '/app/__' + uiFileKey + '-index.' + this.props.cssPreprocessor.extension,
    dest: appPathDest + '/app/index.' + this.props.cssPreprocessor.extension
  });

  // There is 2 ways of dealing with vendor styles
  // - If the vendor styles exist in the css preprocessor chosen,
  //   the best is to include directly the source files
  // - If not, the vendor styles are simply added as standard css links
  //
  // isVendorStylesPreprocessed defines which solution has to be used
  // regarding the ui framework and the css preprocessor chosen.
  this.isVendorStylesPreprocessed = false;

  if(this.props.cssPreprocessor.extension === 'scss') {
    if(this.props.ui.key === 'bootstrap' || this.props.ui.key === 'foundation') {
      this.isVendorStylesPreprocessed = true;
    }
  } else if(this.props.cssPreprocessor.extension === 'less') {
    if(this.props.ui.key === 'bootstrap') {
      this.isVendorStylesPreprocessed = true;
    }
  }

  if(this.isVendorStylesPreprocessed && this.props.ui.name !== null) {
    // var styleVendorSource = 'src/app/__' + uiFileKey + '-vendor.' + this.props.cssPreprocessor.extension;
    // this.styleCopies[styleVendorSource] = appPath + '/app/vendor.' + this.props.cssPreprocessor.extension;
    this.copies.push({
      src: appPathSource + '/app/__' + uiFileKey + '-vendor.' + this.props.cssPreprocessor.extension,
      dest: appPathDest + '/app/vendor.' + this.props.cssPreprocessor.extension
    });
  }
};
