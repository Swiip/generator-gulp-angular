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

The root directory generated for a app with name `gulpAngular` :
<pre>
├──  src/
│   ├──  app/
│   │   ├──  main/
│   │   │   ├──  main.controller.js
│   │   │   ├──  main.controller.spec.js
│   │   │   └──  main.html
│   │   └──  index.js
│   │   └──  index.(css|less|scss)
│   │   └──  vendor.(css|less|scss)
│   ├──  assets/
│   │   └──  images/
│   ├──  components/
│   │   └──  navbar/
│   │   │   ├──  navbar.controller.js
│   │   │   └──  navbar.html
│   ├──  404.html
│   ├──  favico.ico
│   └──  index.html
├──  gulp/
├──  e2e/
├──  bower_components/
├──  nodes_modules/
├──  .bowerrc
├──  .editorconfig
├──  .gitignore
├──  .jshintrc
├──  bower.json
├──  gulpfile.js
├──  karma.conf.js
├──  package.json
├──  protractor.conf.js
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

[All changes listed in the GitHub releases](https://github.com/Swiip/generator-gulp-angular/releases)

## Contributing

**Style Guide:**
Please brief yourself on [Idiomatic.js](https://github.com/rwldrn/idiomatic.js) style guide with two space indent  

**Unit test:**
Unit test are written in [Mocha](http://visionmedia.github.io/mocha/). Please add a unit test for every new feature or bug fix. `npm test` to run the test suite.  

**Documentation:**
Add documentation for every new feature, directory structure change. Feel free to send corrections or better docs!  

Like any other Open Source project, the best way to contribute is through opening GitHub issues.
Bug or suggestions, everything is welcomed.
To save time for both of us, just make sure the issue is in the scope of the generator, this question can be a little tricky on this particular project.

If you have nothing to say but only feeling generous, there's a Gratipay.

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.1.3/dist/gratipay.png)](https://gratipay.com/Swiip/)

As I'm not anymore alone working on this project but we're not enough to bring up a real organization, the money will come to me and I will redistribute evenly between all the current contributors.

## License

MIT
