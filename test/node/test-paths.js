'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var _ = require('lodash');

var Generator = require('./mock-generator');
var generator;

var utils = require('../../generators/app/src/utils.js');

var paths = require('../../generators/app/src/paths.js');

var pathsConf = {
  'app-path': 'src',
  'dist-path': 'dist',
  'e2e-path': 'e2e',
  'tmp-path': 'tmp'
};

describe('gulp-angular generator paths script', function () {
  var isAbsolutePath;
  var normalizePath;

  before(function () {
    paths(Generator);
  });

  beforeEach(function () {
    generator = new Generator();
    _.forEach(pathsConf, function (value, key) {
      generator.options[key] = 'path/' + key;
    });
    isAbsolutePath = sinon.stub(utils, 'isAbsolutePath');
    normalizePath = sinon.stub(utils, 'normalizePath');
  });

  afterEach(function () {
    isAbsolutePath.restore();
    normalizePath.restore();
  });

  describe('check each paths', function () {
    it('should log error if path is absolute', function () {
      isAbsolutePath.returns(true);
      normalizePath.returns('test');
      sinon.spy(generator.env, 'error');
      generator.checkPaths();
      isAbsolutePath.should.have.been.callCount(4);
      normalizePath.should.have.been.callCount(4);
      generator.env.error.should.have.been.callCount(4);
    });

    it('should log nothing if path is absolute', function () {
      isAbsolutePath.returns(false);
      normalizePath.returns('test');
      sinon.spy(generator.env, 'error');
      generator.checkPaths();
      isAbsolutePath.should.have.been.callCount(4);
      normalizePath.should.have.been.callCount(4);
      generator.env.error.should.have.not.been.called;
    });
  });

  describe('store paths in the props', function () {
    it('should store same values as in options', function () {
      generator.storePaths();
      _.forEach(pathsConf, function (value, key) {
        generator.props.paths[value].should.be.equal(generator.options[key]);
      });
    });
  });

  describe('compute paths', function () {
    it('should add as many .. as src sub folders', function () {
      generator.props = { paths: { src: 'test/path' } };
      generator.computePaths();
      generator.computedPaths.appToBower.should.be.equal('../..');
    });
  });

});
