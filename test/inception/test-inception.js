'use strict';
/* jshint expr:true */

var inception = require('../inception');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var prompts = require('../../app/src/mock-prompts.js').prompts;

describe('gulp-angular generator inception tests', function () {
  var gulpAngular;

  this.timeout(100000);

  describe('with default prompts', function () {
    before(function() {
      return inception.prepare({}, {}).then(function(generator) {
        gulpAngular = generator;
      });
    });

    it('should pass build', function () {
      return inception.run(gulpAngular, 'build').should.be.fulfilled;
    });
    it('should pass test', function () {
      return inception.run(gulpAngular, 'test').should.be.fulfilled;
    });
    it('should pass protractor', function () {
      return inception.run(gulpAngular, 'protractor').should.be.fulfilled;
    });
    it('should pass protractor:dist', function () {
      return inception.run(gulpAngular, 'protractor:dist').should.be.fulfilled;
    });
  });

  describe('with [angular 1.2.x, jQuery 2.x.x, Restangular, UI-Router, Foundation, angular-foundation, CSS, Coffee, Jade]', function () {
    before(function() {
      return inception.prepare({}, {
        angularVersion: prompts.angularVersion.values['1.2'],
        jQuery: prompts.jQuery.values['jquery 2'],
        resource: prompts.resource.values.restangular,
        router: prompts.router.values['ui-router'],
        ui: prompts.ui.values.foundation,
        foundationComponents: prompts.foundationComponents.values['angular-foundation'],
        cssPreprocessor: prompts.cssPreprocessor.values.none,
        jsPreprocessor: prompts.jsPreprocessor.values.coffee,
        htmlPreprocessor: prompts.htmlPreprocessor.values.jade
      }).then(function(generator) {
        gulpAngular = generator;
      });
    });

    it('should pass build', function () {
      return inception.run(gulpAngular, 'build').should.be.fulfilled;
    });
    it('should pass test', function () {
      return inception.run(gulpAngular, 'test').should.be.fulfilled;
    });
    it('should pass protractor', function () {
      return inception.run(gulpAngular, 'protractor').should.be.fulfilled;
    });
    it('should pass protractor:dist', function () {
      return inception.run(gulpAngular, 'protractor:dist').should.be.fulfilled;
    });
  });

  describe('with [ZeptoJS 1.1.x, $http, Bootstrap, LESS, ES6 with Babel, hamljs]', function () {
    before(function() {
      return inception.prepare({}, {
        jQuery: prompts.jQuery.values['zeptojs 1.1'],
        resource: prompts.resource.values.none,
        router: prompts.router.values.none,
        ui: prompts.ui.values.bootstrap,
        bootstrapComponents: prompts.bootstrapComponents.values['ui-bootstrap'],
        cssPreprocessor: prompts.cssPreprocessor.values.less,
        jsPreprocessor: prompts.jsPreprocessor.values['babel'],
        htmlPreprocessor: prompts.htmlPreprocessor.values.haml
      }).then(function(generator) {
        gulpAngular = generator;
      });
    });

    it('should pass build', function () {
      return inception.run(gulpAngular, 'build').should.be.fulfilled;
    });
    it('should pass test', function () {
      return inception.run(gulpAngular, 'test').should.be.fulfilled;
    });
    it('should pass protractor', function () {
      return inception.run(gulpAngular, 'protractor').should.be.fulfilled;
    });
    it('should pass protractor:dist', function () {
      return inception.run(gulpAngular, 'protractor:dist').should.be.fulfilled;
    });
  });

  describe('with [jQuery 1, $http, ngMaterial, Stylus, TypeScript, handlebars]', function () {
    before(function() {
      return inception.prepare({}, {
        jQuery: prompts.jQuery.values['jquery 1'],
        ui: prompts.ui.values['angular-material'],
        cssPreprocessor: prompts.cssPreprocessor.values.stylus,
        jsPreprocessor: prompts.jsPreprocessor.values.typescript,
        htmlPreprocessor: prompts.htmlPreprocessor.values.handlebars
      }).then(function(generator) {
        gulpAngular = generator;
      });
    });

    it('should pass build', function () {
      return inception.run(gulpAngular, 'build').should.be.fulfilled;
    });
    it('should pass test', function () {
      return inception.run(gulpAngular, 'test').should.be.fulfilled;
    });
    it('should pass protractor', function () {
      return inception.run(gulpAngular, 'protractor').should.be.fulfilled;
    });
    it('should pass protractor:dist', function () {
      return inception.run(gulpAngular, 'protractor:dist').should.be.fulfilled;
    });
  });

  describe('with [src:src/angular/app e2e:tests/e2e dist:target/build/folder tmp:.tmp/folder] and default promps', function () {
    before(function() {
      return inception.prepare({
        'app-path': 'src/angular/app',
        'dist-path': 'target/build/folder',
        'e2e-path': 'tests/e2e',
        'tmp-path': '.tmp/folder'
      }, {}).then(function(generator) {
        gulpAngular = generator;
      });
    });

    it('should pass build', function () {
      return inception.run(gulpAngular, 'build').should.be.fulfilled;
    });
    it('should pass test', function () {
      return inception.run(gulpAngular, 'test').should.be.fulfilled;
    });
    it('should pass protractor', function () {
      return inception.run(gulpAngular, 'protractor').should.be.fulfilled;
    });
    it('should pass protractor:dist', function () {
      return inception.run(gulpAngular, 'protractor:dist').should.be.fulfilled;
    });
  });

});
