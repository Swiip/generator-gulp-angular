'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular angular version', function () {
  var bowerTemplate, model;

  before(function() {
    return templateTools.load('_bower.json')
      .then(function(templateModule) {
        bowerTemplate = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should put the right angular version in the bower.json', function() {
    model.props.angularVersion = 'angular-test-version';
    var result = bowerTemplate(model);
    result.should.match(/"angular-animate": "angular-test-version"/);
    result.should.match(/"angular-cookies": "angular-test-version"/);
    result.should.match(/"angular-touch": "angular-test-version"/);
    result.should.match(/"angular-sanitize": "angular-test-version"/);
    result.should.match(/"angular-resource": "angular-test-version"/);
    result.should.match(/"angular-route": "angular-test-version"/);
    result.should.match(/"angular": "angular-test-version"/);
  });

});
