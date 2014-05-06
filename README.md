# generator-gulp-angular [![Build Status](https://secure.travis-ci.org/Swiip/generator-gulp-angular.svg?branch=master)](http://travis-ci.org/Swiip/generator-gulp-angular)

Offers you a Yeoman generator to initiate a Web application with the following workflow:

<img height="100" align="left" src="https://raw.githubusercontent.com/yeoman/yeoman.io/master/app/assets/img/bullet-yo.gif">

<img height="100" align="left" src="http://bower.io/img/bower-logo.png">

<img height="100" align="left" src="https://s3.amazonaws.com/media-p.slid.es/uploads/hugojosefson/images/86267/angularjs-logo.png">

<img height="100" align="left" src="https://raw.github.com/gulpjs/artwork/master/gulp.png">

<br><br><br><br>

## Why generator-gulp-angular ?

This generator aims to takes the best from others generators like generator-angular, ngTailor and generator-gulp-webapp to offers the best workflow to start an application with AngularJS powered by Gulp!

generator-gulp-angular scaffolds out an Angularjs application with a full featured gulpfile.js wich offers all the tasks for a modern Web development.

## Usage

### Create your project

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
* `gulp watch` to launch a server with livereload capacities on your source files
* `gulp serve:dist` to launch a server on your optimized application
* `gulp wiredep` to fill bower dependencies in your `.html` file(s)
* `gulp test` to launch your unit tests with Karma
* `gulp protractor` to launch your e2e tests with Protractor
* `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files

## Directory structure

[Best Practice Recommendations for Angular App Structure](https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub)

But I think keeping first division by file type: scripts, styles, partials.

## Features included in the gulpfile
* useref
* ngMin
* uglify
* csso
* rev
* watch
* connect
* jshint
* **TODO** image optimization
* **TODO** lazy
* **TODO** browser sync
* Unit test
* e2e test
* **TODO** partials bundeling in js

## Questions the generator will asks
* **TODO** jQuery: jQuery, Zepto, none
* **TODO** Angular modules: resources, animate...
* **TODO** Angular UI modules: Bootstrap, Router, Utils...
* **TODO** CSS Framework: Bootstrap with CSS, sass or less.
* **TODO** CSS preprocessor: less, sass, none
* **TODO** JS preprocessor: CoffeeScript, TypeScript, ECMAScript6 (Traceur)
* **TODO** HTML preprocessor: Jade ?
* **TODO** *Script loader: Require, Browserify, ES6 with Require ?*
* **TODO** Test framework: Jasmine, Mocha, Qunit

## Changelog

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
