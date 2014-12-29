'use strict';

var path = require('path');
var files = require('../files.json');
var fs = require('fs');

module.exports = function () {
  var _ = this._;

  // Retrieve props stored in .yo-rc.json
  if (this.skipConfig || this.options['default']) {
    this.props = this.config.get('props');
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
    this.props.bootstrapComponents.module,
    this.props.foundationComponents.module
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
    this.props.foundationComponents.key,
    this.props.cssPreprocessor.key,
    this.props.jsPreprocessor.key
  ]
    .filter(_.isString)
    .filter(function(tech) {
      return tech !== 'default' && tech !== 'css' && tech !== 'official' && tech !== 'none';
    });

  _.forEach(this.props.htmlPreprocessors, function(preprocessor) {
    usedTechs.push(preprocessor.key);
  });

  var techsContent = _.map(usedTechs, function(value) {
    return listTechs[value];
  });

  this.technologies = JSON.stringify(techsContent, null, 2)
    .replace(/'/g, '\\\'')
    .replace(/"/g, '\'')
    .replace(/\n/g, '\n    ');
  this.technologiesLogoCopies = _.map(usedTechs, function(value) {
    return 'src/assets/images/' + listTechs[value].logo;
  });

  this.partialCopies = {};

  var navbarPartialSrc = 'src/components/navbar/__' + this.props.ui.key + '-navbar.html';
  this.partialCopies[navbarPartialSrc] = 'src/components/navbar/navbar.html';

  var routerPartialSrc = 'src/app/main/__' + this.props.ui.key + '.html';
  if(this.props.router.module !== null) {
    this.partialCopies[routerPartialSrc] = 'src/app/main/main.html';
  }

  // Compute routing relative to props.router
  if (this.props.router.module === 'ngRoute') {
    this.routerHtml = '<div ng-view></div>';
    this.routerJs = this.read('src/app/__ngroute.' + this.props.jsPreprocessor.extension, 'utf8');
  } else if (this.props.router.module === 'ui.router') {
    this.routerHtml = '<div ui-view></div>';
    this.routerJs = this.read('src/app/__uirouter.' + this.props.jsPreprocessor.extension, 'utf8');
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
  if (this.props.ui.key === 'bootstrap') {
    if(this.props.bootstrapComponents.key !== 'official') {

      if(this.props.cssPreprocessor.extension === 'scss') {
        this.wiredepExclusions.push('/bootstrap-sass-official/');
      } else {
        this.wiredepExclusions.push('/bootstrap\\.js/');
      }
    }

    if(this.props.cssPreprocessor.key !== 'none') {
      this.wiredepExclusions.push('/bootstrap\\.css/');
    }

  } else if (this.props.ui.key === 'foundation') {

    if(this.props.foundationComponents.key !== 'official') {
      this.wiredepExclusions.push('/foundation\\.js/');
    }

    if(this.props.cssPreprocessor.key !== 'none') {
      this.wiredepExclusions.push('/foundation\\.css/');
    }
  }
  if(this.props.cssPreprocessor.key !== 'none') {
    this.wiredepExclusions.push('/bootstrap\\.css/');
    this.wiredepExclusions.push('/foundation\\.css/');
  }

  // Format choice UI Framework
  if(this.props.ui.key.indexOf('bootstrap') !== -1 && this.props.cssPreprocessor.extension !== 'scss') {
    this.props.ui.name = 'bootstrap';
  }

  this.styleCopies = {};

  var styleAppSrc = 'src/app/__' + this.props.ui.key + '-index.' + this.props.cssPreprocessor.extension;
  this.styleCopies[styleAppSrc] = 'src/app/index.' + this.props.cssPreprocessor.extension;

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
    var styleVendorSource = 'src/app/__' + this.props.ui.key + '-vendor.' + this.props.cssPreprocessor.extension;
    this.styleCopies[styleVendorSource] = 'src/app/vendor.' + this.props.cssPreprocessor.extension;
  }

  //JS Preprocessor files
  function resolvePaths(template) {
    return function(filesObject, file) {
      var src = file, dest = file;

      if(template) {
        var basename = path.basename(file);
        src = file.replace(basename, '_' + basename);
      }

      if(src.match(/\.js$/)) {
        var preprocessorFile = this.sourceRoot() + '/' + src.replace(/\.js$/, '.' + this.props.jsPreprocessor.srcExtension);
        if(fs.existsSync(preprocessorFile)) {
          src = src.replace(/\.js$/, '.' + this.props.jsPreprocessor.srcExtension);
          dest = dest.replace(/\.js$/, '.' + this.props.jsPreprocessor.extension);
        }
      }

      filesObject[src] = dest;
      return filesObject;
    };
  }

  this.srcTemplates = files.templates.reduce(resolvePaths(true).bind(this), {});

  this.staticFiles = files.staticFiles.reduce(resolvePaths(false).bind(this), {});

  this.lintConfCopies = [];
  if(this.props.jsPreprocessor.key === 'coffee') {
    this.lintConfCopies.push('coffeelint.json');
  }

  function dependencyString(dep, version) {
    return '"' + dep + '": ' + '"' + version + '"';
  }

  this.consolidateExtensions = [];

  this.npmDevDependencies = [];
  this.consolidateParameters = [];

  // Adding npm dev dependencies
  _.forEach(this.props.htmlPreprocessors, function(preprocessor) {
    _.forEach(preprocessor.npm, function(version, dep) {
      this.npmDevDependencies.push(dependencyString(dep, version));
    }.bind(this));
    this.consolidateParameters.push(
      JSON.stringify(preprocessor.consolidate).
        replace(/"/g,'\'')); // Replace " with ' and assume this won't break anything.
    this.consolidateExtensions.push(preprocessor.extension);
  }.bind(this));

};
