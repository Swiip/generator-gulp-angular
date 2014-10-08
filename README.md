# generator-gulp-angular [![Build Status](https://secure.travis-ci.org/Swiip/generator-gulp-angular.svg?branch=master)](http://travis-ci.org/Swiip/generator-gulp-angular)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/Swiip/generator-gulp-angular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Offers you a Yeoman generator to initiate a Web application with the following workflow:

<img height="100" align="left" src="https://raw.githubusercontent.com/yeoman/yeoman.io/master/app/assets/img/bullet-yo.gif">

<img height="100" align="left" src="https://raw.github.com/gulpjs/artwork/master/gulp.png">

<img height="100" align="left" src="http://bower.io/img/bower-logo.png">

<img height="100" align="left" src="https://s3.amazonaws.com/media-p.slid.es/uploads/hugojosefson/images/86267/angularjs-logo.png">

<br><br><br><br>

## Why generator-gulp-angular ?

This generator combines the best features of other generators like [generator-angular](https://github.com/yeoman/generator-angular), [ngTailor](https://github.com/lauterry/generator-ngtailor) and [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp) into an optimal workflow for starting applications with AngularJS powered by Gulp!

generator-gulp-angular scaffolds an AngularJS application with a full-featured gulpfile.js, giving you immediate out-of-the-box access to all tasks for modern web development.


My intention is to create a generator that gives users total control over their development toolbox so they can immediately start projects with their preferred tools, such as specific UI frameworks or JavaScript preprocessors.

## Usage

### Create your project

Install the required tools: `yo`, `gulp`, `bower`
```
npm install -g yo gulp bower
```

Install `generator-gulp-angular`:
```
npm install -g generator-gulp-angular
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo gulp-angular`, optionally passing an app name:
```
yo gulp-angular [app-name]
```

### Use Gulp tasks

* `gulp` or `gulp build` to build an optimized version of your application in `/dist`
* `gulp serve` to launch a browser sync server on your source files
* `gulp serve:dist` to launch a server on your optimized application
* `gulp wiredep` to fill bower dependencies in your `.html` file(s)
* `gulp test` to launch your unit tests with Karma
* `gulp protractor` to launch your e2e tests with Protractor
* `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files

## Directory structure

[Best Practice Recommendations for Angular App Structure](https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub)

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
* *ngHtml2js* : all HTML partials will be converted to JS to be bundled in the application
* **TODO** lazy : don't process files which haven't changed when possible

## Questions the generator will ask
* *jQuery*: jQuery 1.x, 2.x, Zepto, none
* *Angular modules*: animate, cookies, touch, sanitize
* *Resource handler*: ngResource, Restangular, none
* *Router*: ngRoute, UI Router, none
* *UI Framework*: Bootstrap, Foundation, none (depends on the chosen CSS preprocessor)
* *CSS pre-processor*: Less, Sass with Ruby and Node, none
* **TODO** Bootstrap directives : UI Bootstrap, Angular Strap, none (only if you chose Bootstrap)
* **TODO** JS preprocessor: CoffeeScript, TypeScript, ECMAScript6 (Traceur)
* **TODO** HTML preprocessor: Jade ?
* **TODO** Script loader: Require, Browserify, ES6 with Require?, none
* **TODO** Test framework: Jasmine, Mocha, Qunit

## Known issue

Protractor tests are not stable with PhantomJS, at least not on my Mac. I'm getting unpredictable disconnections between webdriverjs and phantomjs.

I tried many configurations for Protractor without success, any hint would be appreciated.

## Changelog

### 0.6.0

* **Breaking Change** Directory structure evolved to the recommendations from the Angular team. *Do not run this version of the generator on an existing project generated with a previous version*
* Isolation of the proxy middleware, some fixes and disabling by default
* Minifying HTML (index, not the partials)
* Thanks to @intellix, @marani and special thanks to @zckrs wich join me as commiter

### 0.5.1

* Restore CSS wiring with wiredep
* Fix the fast mode which was using an old version of Bootstrap
* Stabilization of the CSS preprocessor choices
* Bunch of Node dependencies update
* Fix #39, #41, #42, #44, #46, #49
* Thanks to @marani

### 0.5.0

* Add CSS preprocessor option: Sass with Node & Ruby, Less or none. Adapt itself with the UI framework
* Add Angular version option : 1.2 or 1.3
* Thanks to @adamshiervani

### 0.4.1

* Update lots of NPM deps which fixed some bugs
* Add option of no UI framework
* Thanks to @GlennGeenen @rajington @otaviosoares @wrseward @gregoirjopla

### 0.4.0

* Add option to choose between Foundation or Bootstrap as UI Framework
* New welcome page presenting integrated technologies
* Several package updates: `yosay`, `browsersync`, `modernizr`, `protractor`...
* Some bug fixes: #6, #7, #8
* Add some documentation
* Thanks to @shinnn

### 0.3.1

* Fix e2e tests to use BrowserSync as server. But no way to stop BrowserSync for now so the task never really ends.
* Thanks to @jbpionnier @KevinLlopart

### 0.3.0

* Integration of BrowserSync as development server in place of a home made connect server
* Serve task is the entry point and launch the watch task

### 0.2.1

* Fix main.html missing with routing
* Fix unit tests by ignoring bootstrap js files in wiredep

### 0.2.0

* Convert HTML templates into JS and add them into the optimized bundle
* Let you choose to use jQuery, Zepto or nothing (Angular's jqLite)
* Ask for optional Angular modules: animate cookies, touch and sanitize
* Resource handler: ngResource, Restangular, none.
* Router: ngRoute, UI Router, none.

### 0.1.1

* Adding Travis CI

### 0.1.0

* Add unit test with karma and e2e test with protractor
* Split gulp configuration in multiple files
* Create 'inception' test which generate files and try gulp tasks on it
* Add ability to serve dist files and run e2e test on dist files
* Still no options

### 0.0.1

* Initial commit
* Scaffolds a working directory but with no options and no tests

## License

MIT
