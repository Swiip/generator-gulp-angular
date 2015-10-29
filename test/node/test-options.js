'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Generator = require('./mock-generator');
var generator;

var options = require('../../generators/app/src/options.js');
var optionsJson = require('../../generators/app/options.json');

describe('gulp-angular generator options script', function () {

  before(function () {
    options(Generator);
    sinon.stub(process, 'cwd').returns('test directory-pathName');
  });

  after(function () {
    process.cwd.restore();
  });

  beforeEach(function () {
    generator = new Generator();
  });

  describe('run generator.option for each option from options.json', function () {
    it('should call option() same times as entries in options.json', function () {
      sinon.spy(generator, 'option');
      generator.defineOptions();
      generator.option.should.have.callCount(optionsJson.length);
    });
  });

  describe('define appName', function () {
    it('should define from current directory', function () {
      generator.determineAppName();
      generator.appName.should.be.equal('testDirectoryPathName');
    });

    it('should define from options if set', function () {
      generator.appName = 'appNameFromOption';
      generator.determineAppName();
      generator.appName.should.be.equal('appNameFromOption');
    });
  });

});
