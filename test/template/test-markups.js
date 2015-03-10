'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular markups template', function () {
  var markups, model;

  before(function() {
    return templateTools.load('gulp/_markups.js')
      .then(function(templateModule) {
        markups = templateModule;
      });
  });

  beforeEach(function() {
    model = mockModel();
  });

  it('should select the right template engine for consolidate', function() {
    model.props.htmlPreprocessor.key = 'none';
    var result = markups(model);
    result.should.not.match(/consolidate/);

    model.props.htmlPreprocessor.key = 'jade';
    result = markups(model);
    result.should.match(/\$\.consolidate\('jade', \{ basedir: options\.src, doctype: 'html', pretty: '  ' \}/);

    model.props.htmlPreprocessor.key = 'haml';
    result = markups(model);
    result.should.match(/\$\.consolidate\('haml'\)/);

    model.props.htmlPreprocessor.key = 'handlebars';
    result = markups(model);
    result.should.match(/\$\.consolidate\('handlebars'\)/);
  });

});
