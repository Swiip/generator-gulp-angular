'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular index js template', function () {
  var model;
  var indexHtml;

  before(function () {
    return templateTools.load('src/_index.html')
      .then(function (templateModule) {
        indexHtml = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should insert the app name in the title and the ng-app directive', function () {
    model.appName = 'testAppName';
    var result = indexHtml(model);
    result.should.match(/ng-app="testAppName">/);
    result.should.match(/<title>testAppName<\/title>/);
  });

  it('should insert the vendor build block depending of data', function () {
    model.props.cssPreprocessor.key = 'noCssPrepro';
    model.props.paths.src = 'src';
    model.props.paths.tmp = 'tmp';
    var result = indexHtml(model);
    result.should.match(/<!-- build:css\({tmp\/serve,src}\) styles\/vendor\.css -->/);
    result.should.not.match(/<link rel="stylesheet" href="app\/vendor\.css">/);
  });

  it('should insert modernizr if selected', function () {
    model.props.paths.src = 'src';
    model.includeModernizr = false;
    var result = indexHtml(model);
    result.should.not.match(/<!-- build:js\(src\) scripts\/modernizr.js -->/);
    result.should.not.match(/<html class="no-js"/);

    model.includeModernizr = true;
    result = indexHtml(model);
    result.should.match(/<!-- build:js\(src\) scripts\/modernizr.js -->/);
    result.should.match(/<html class="no-js"/);

    model.props.jsPreprocessor.key = 'typescript';
    model.includeModernizr = false;
    result = indexHtml(model);
    result.should.not.match(/<!-- build:js\(src\) scripts\/modernizr.js -->/);
    result.should.not.match(/<html class="no-js"/);

    model.includeModernizr = true;
    result = indexHtml(model);
    result.should.match(/<!-- build:js\(src\) scripts\/modernizr.js -->/);
    result.should.match(/<html class="no-js"/);
  });

  it('should insert routerHtml content', function () {
    model.routerHtml = 'router html content';
    var result = indexHtml(model);
    result.should.match(/[\s\S]*router html content[\s\S]*/);
  });

  it('should not look in src folder for app.js with es6', function () {
    model.props.paths.src = 'src';
    model.props.jsPreprocessor.srcExtension = 'not es6';
    var result = indexHtml(model);
    result.should.match(/partials,src\}\) scripts\/app\.js -->/);

    model.props.jsPreprocessor.srcExtension = 'es6';
    result = indexHtml(model);
    result.should.match(/partials\}\) scripts\/app\.js -->/);
  });

});
