'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var templateTools = require('../template-tools');
var mockModel = require('./mock-model');

describe('gulp-angular styles template', function () {
  var styles;
  var model;

  before(function () {
    return templateTools.load('gulp/_styles.js')
      .then(function (templateModule) {
        styles = templateModule;
      });
  });

  beforeEach(function () {
    model = mockModel();
  });

  it('should add options for each css preprocessors', function () {
    model.props.cssPreprocessor.key = 'noCssPrepro';
    model.props.cssPreprocessor.extension = 'css';
    var result = styles(model);
    result.should.not.match(/lessOptions/);
    result.should.not.match(/sassOptions/);

    model.props.cssPreprocessor.key = 'less';
    model.props.cssPreprocessor.extension = 'less';
    result = styles(model);
    result.should.match(/lessOptions/);
    result.should.not.match(/sassOptions/);

    model.props.cssPreprocessor.key = 'node-sass';
    model.props.cssPreprocessor.extension = 'scss';
    result = styles(model);
    result.should.match(/sassOptions/);
    result.should.not.match(/lessOptions/);
  });

  it('should process files with the right preprocessor', function () {
    model.props.cssPreprocessor.key = 'noCssPrepro';
    model.props.cssPreprocessor.extension = 'css';
    var result = styles(model);
    result.should.match(/conf\.paths\.src, '\/app\/index\.css/);
    result.should.not.match(/less/);
    result.should.not.match(/sass/);
    result.should.not.match(/stylus/);

    model.props.cssPreprocessor.key = 'ruby-sass';
    model.props.cssPreprocessor.extension = 'scss';
    result = styles(model);
    result.should.match(/conf\.paths\.src, '\/app\/index\.scss/);
    result.should.match(/\$\.rubySass\(sassOptions\)/);
    result.should.not.match(/less/);
    result.should.not.match(/stylus/);

    model.props.cssPreprocessor.key = 'node-sass';
    model.props.cssPreprocessor.extension = 'scss';
    result = styles(model);
    result.should.match(/conf\.paths\.src, '\/app\/index\.scss/);
    result.should.match(/\$\.sass\(sassOptions\)/);
    result.should.not.match(/less/);
    result.should.not.match(/stylus/);

    model.props.cssPreprocessor.key = 'less';
    model.props.cssPreprocessor.extension = 'less';
    result = styles(model);
    result.should.match(/conf\.paths\.src, '\/app\/index\.less/);
    result.should.match(/\$\.less\(lessOptions\)/);
    result.should.not.match(/sass/);
    result.should.not.match(/stylus/);

    model.props.cssPreprocessor.key = 'stylus';
    model.props.cssPreprocessor.extension = 'styl';
    result = styles(model);
    result.should.match(/conf\.paths\.src, '\/app\/index\.styl/);
    result.should.match(/\$\.stylus\(\)/);
    result.should.not.match(/sass/);
    result.should.not.match(/less/);
  });

});
