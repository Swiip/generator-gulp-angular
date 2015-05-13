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


## Install

##### Install required tools `yo`, `gulp` and `bower`:
```
npm install -g yo gulp bower
```

##### Install `generator-gulp-angular`:
```
npm install -g generator-gulp-angular
```


## Usage

##### Create a new directory, and go into:
```
mkdir my-new-project && cd $_
```

##### Run `yo gulp-angular`, and select desired technologies: 
```
yo gulp-angular
```


## Options

##### Prompts
* `--default` use our preferred configurations, default is `false`
* `--advanced` print additional features, default is `false`

##### Paths folders (relative to cwd)
* `--app-path='src'` set your application folder, default is `src`
* `--dist-path='dist'` set your build target, default is `dist`
* `--e2e-path='e2e'` set your e2e test specs, default is `e2e`
* `--tmp-path='.tmp'` set your pre-processing folder, default is `.tmp`

Paths configuration are stored in `gulpfile.js`. Change `options.(src|dist|tmp|e2e)` in `gulpfile.js` if you want to config paths after the app is generated.

**Warning**: The paths are also written in the `index.html` for the build with useref. If you want to change these paths, you also have to change the paths there in order to have the build task working.


## Generators

##### App
*  `yo gulp-angular [appName]`

*Sets up a new AngularJS app, generating all the boilerplate you need to get started.
Follow the prompts.*

## Use Gulp tasks

* `gulp` to build an optimized version of your application in `/dist`
* `gulp serve` to launch a browser sync server on your source files
* `gulp serve:dist` to launch a server on your optimized application
* `gulp test` to launch your unit tests with Karma
* `gulp test:auto` to launch your unit tests with Karma in watch mode
* `gulp protractor` to launch your e2e tests with Protractor
* `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files

More information on the gulp tasks in [this README.md](app/templates/gulp/README.md).


## Directory structure

[Best Practice Recommendations for Angular App Structure](https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub)

The root directory generated with default paths configuration for application with name `gulpAngular`:
<pre>
├──  bower_components/
├──  e2e/
├──  gulp/
├──  nodes_modules/
│
├──  src/
│   ├──  app/
│   │   ├──  components/
│   │   │   └──  githubContributor/
│   │   │   │   └──  githubContributor.service.js
│   │   │   │
│   │   │   └──  malarkey/
│   │   │   │   ├──  malarkey.directive.js
│   │   │   │   └──  malarkey.(scss|styl|less|css)
│   │   │   │
│   │   │   └──  navbar/
│   │   │   │   ├──  navbar.directive.js
│   │   │   │   ├──  navbar.html
│   │   │   │   └──  navbar.(scss|styl|less|css)
│   │   │   │
│   │   │   └──  webDevTec/
│   │   │       └──  webDevTec.service.js
│   │   │   
│   │   ├──  main/
│   │   │   ├──  main.controller.js
│   │   │   ├──  main.controller.spec.js
│   │   │   └──  main.html
│   │   │   
│   │   └──  index.config.js
│   │   └──  index.constants.js
│   │   └──  index.module.js
│   │   └──  index.route.js
│   │   └──  index.run.js
│   │   └──  index.(scss|styl|less|css)
│   │   └──  vendor.(scss|styl|less|css)
│   │
│   ├──  assets/
│   │   └──  images/
│   ├──  favico.ico
│   └──  index.html
│
├──  .bowerrc
├──  .editorconfig
├──  .gitignore
├──  .jshintrc
├──  bower.json
├──  gulpfile.js
├──  karma.conf.js
├──  package.json
└──  protractor.conf.js
</pre>


## Features included in the gulpfile

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
* **TODO** lazy : don't process files which haven't changed when possible


## Questions the generator will ask

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
* **TODO** Script loader: Require, Webpack, none
* **TODO** Test framework: Jasmine, Mocha, Qunit


## Changelog

[All changes listed in the GitHub releases](https://github.com/Swiip/generator-gulp-angular/releases)


## Contributing

[Guidelines](CONTRIBUTING.md)


## License

MIT
