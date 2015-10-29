'use strict';

var inception = require('../inception');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var prompts = require('../../generators/app/src/mock-prompts.js').prompts;

describe('gulp-angular generator inception tests', function () {
  var gulpAngular;

  this.timeout(100000);

  describe('with default prompts', function () {
    before(function () {
      return inception.prepare({}, {}).then(function (generator) {
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

  describe('with [angular 1.3.x, jQuery 2.x.x, Restangular, UI-Router, Foundation, angular-foundation, CSS, Coffee, Jade]', function () {
    before(function () {
      return inception.prepare({}, {
        angularVersion: prompts.angularVersion.values['1.3'],
        jQuery: prompts.jQuery.values.jquery2,
        resource: prompts.resource.values.restangular,
        router: prompts.router.values['ui-router'],
        ui: prompts.ui.values.foundation,
        foundationComponents: prompts.foundationComponents.values['angular-foundation'],
        cssPreprocessor: prompts.cssPreprocessor.values.noCssPrepro,
        jsPreprocessor: prompts.jsPreprocessor.values.coffee,
        htmlPreprocessor: prompts.htmlPreprocessor.values.jade
      }).then(function (generator) {
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
    before(function () {
      return inception.prepare({}, {
        jQuery: prompts.jQuery.values.zepto,
        resource: prompts.resource.values.$http,
        router: prompts.router.values.noRouter,
        ui: prompts.ui.values.bootstrap,
        bootstrapComponents: prompts.bootstrapComponents.values['ui-bootstrap'],
        cssPreprocessor: prompts.cssPreprocessor.values.less,
        jsPreprocessor: prompts.jsPreprocessor.values.babel,
        htmlPreprocessor: prompts.htmlPreprocessor.values.haml
      }).then(function (generator) {
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

  describe('with [jQuery 1, $http, new router, ngMaterial, Stylus, TypeScript, handlebars]', function () {
    before(function () {
      return inception.prepare({}, {
        jQuery: prompts.jQuery.values.jquery1,
        router: prompts.router.values['new-router'],
        ui: prompts.ui.values['angular-material'],
        cssPreprocessor: prompts.cssPreprocessor.values.stylus,
        jsPreprocessor: prompts.jsPreprocessor.values.typescript,
        htmlPreprocessor: prompts.htmlPreprocessor.values.handlebars
      }).then(function (generator) {
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

  describe('with [$http, Bootstrap, AngularStrap, ruby-sass, Traceur]', function () {
    before(function () {
      return inception.prepare({}, {
        ui: prompts.ui.values.bootstrap,
        bootstrapComponents: prompts.bootstrapComponents.values['angular-strap'],
        cssPreprocessor: prompts.cssPreprocessor.values['ruby-sass'],
        jsPreprocessor: prompts.jsPreprocessor.values.traceur
      }).then(function (generator) {
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

  describe('with [AngularJS 1.4, jqLite, ngResource, new router, MDL, NodeSass, Javascript, HTML]', function () {
    before(function () {
      return inception.prepare({}, {
        angularVersion: prompts.angularVersion.values['1.4'],
        jQuery: prompts.jQuery.values.jqLite,
        router: prompts.router.values['new-router'],
        ui: prompts.ui.values['material-design-lite'],
        cssPreprocessor: prompts.cssPreprocessor.values['node-sass'],
        jsPreprocessor: prompts.jsPreprocessor.values.noJsPrepro,
        htmlPreprocessor: prompts.htmlPreprocessor.values.noHtmlPrepro
      }).then(function (generator) {
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

  describe('with [src:src/angular/app e2e:tests/e2e dist:target/build/folder tmp:.tmp/folder] and default prompts', function () {
    before(function () {
      return inception.prepare({
        'app-path': 'src/angular/app',
        'dist-path': 'target/build/folder',
        'e2e-path': 'tests/e2e',
        'tmp-path': '.tmp/folder'
      }, {}).then(function (generator) {
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
