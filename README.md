# generator-gulp-angular ![Logo](app/templates/src/assets/images/generator-gulp-angular-logo.png)

[![Build Status](https://img.shields.io/travis/Swiip/generator-gulp-angular/master.svg?style=flat)](http://travis-ci.org/Swiip/generator-gulp-angular)
[![Coverage Status](http://img.shields.io/coveralls/Swiip/generator-gulp-angular.svg?style=flat)](https://coveralls.io/r/Swiip/generator-gulp-angular?branch=master)
[![Dependencies](http://img.shields.io/david/Swiip/generator-gulp-angular.svg?style=flat)](https://david-dm.org/eleven-labs/generator-gulp-angular)
[![NPM Version](http://img.shields.io/npm/v/generator-gulp-angular.svg?style=flat)](https://www.npmjs.org/package/generator-gulp-angular)
[![Download Month](http://img.shields.io/npm/dm/generator-gulp-angular.svg?style=flat)](https://www.npmjs.org/package/generator-gulp-angular)

[![Gitter](http://img.shields.io/badge/Gitter-room-brightgreen.svg?style=flat)](https://gitter.im/Swiip/generator-gulp-angular)

> Yeoman generator for AngularJS + Gulp.

> Lets you quickly set up a project with:
> * your favorites technology
> * web best pratices.
> * guidelines powered by Google.

> Gulp provide fast workspace with quick feedback.


## Usage

More informations, options, parameters in the [usage documentation page](docs/usage.md)

### Install

##### Install required tools `yo`, `gulp` and `bower`:
```
npm install -g yo gulp bower
```

##### Install `generator-gulp-angular`:
```
npm install -g generator-gulp-angular
```


### Usage

##### Create a new directory, and go into:
```
mkdir my-new-project && cd $_
```

##### Run `yo gulp-angular`, and select desired technologies:
```
yo gulp-angular
```


## Features

More informations about how to use your new project is available in the [user guide](docs/user-guide.md) or if you want to know [how it works](docs/how-it-works.md).

### Features included in the gulpfile

* *useref* : allow configuration of your files in comments of your HTML file
* *ngAnnotate* : convert simple injection to complete syntax to be minification proof
* *uglify* : optimize all your JavaScript
* *csso* : optimize all your CSS
* *rev* : add a hash in the file names to prevent browser cache problems
* *watch* : watch your source files and recompile them automatically
* *jshint* : JavaScript code linter
* *imagemin* : all your images will be optimized at build
* *Unit test (karma)* : out of the box unit test configuration with karma
* *e2e test (protractor)* : out of the box e2e test configuration with protractor
* *browser sync* : full-featured development web server with livereload and devices sync
* *angular-templatecache* : all HTML partials will be converted to JS to be bundled in the application


### Questions the generator will ask

* *Angular version*: 1.3.x, 1.2.x
* *Angular modules*: animate, cookies, touch, sanitize
* *jQuery*: 2.x, 1.x, Zepto, none
* *Resource handler*: ngResource, Restangular, none
* *Router*: UI Router, ngRoute, none
* *UI framework*: Bootstrap, Angular Material, Foundation, none
* *UI directives* : Angular UI Bootstrap, Angular Strap, Bootstrap jQuery, Angular Foundation, Foundation Jquery, none (depends on the UI framework)
* *CSS pre-processor*: Sass with Node or Ruby, Less, Stylus, none
* *JS preprocessor*: none, ES6 Babel, ES6 Traceur, CoffeeScript, TypeScript
* *HTML preprocessor*: none, Jade, Haml, Handlebars



## Changelog

[All changes listed in the GitHub releases](https://github.com/Swiip/generator-gulp-angular/releases)


## Contributing

[Guidelines](CONTRIBUTING.md)


## License

MIT
