'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var _ = require('lodash');

var Generator = require('./mock-generator');
var generator;

var files = require('../../generators/app/src/files.js');
var filesJson = require('../../generators/app/files.json');
var savedFilesJson = _.cloneDeep(filesJson);

describe('gulp-angular generator files script', function () {

  before(function () {
    files(Generator);
  });

  after(function () {
    filesJson.staticFiles = savedFilesJson.staticFiles;
    filesJson.templates = savedFilesJson.templates;
  });

  beforeEach(function () {
    generator = new Generator();
  });

  it('should add each files in generator.files', function () {
    filesJson.staticFiles = [
      'test/path/preprocessed.js',
      'test/path/not/preprocessed.js',
      'test/path/not/js/file.css'
    ];
    filesJson.templates = [
      'test/path/template.html'
    ];
    generator.props.jsPreprocessor = {
      srcExtension: 'srcExtension',
      extension: 'extension'
    };
    var exists = sinon.stub(generator.fs, 'exists');
    exists
      .withArgs('/test/path/preprocessed.srcExtension')
      .returns(true);
    exists
      .withArgs('/test/path/not/preprocessed.srcExtension')
      .returns(false);
    generator.prepareFiles();
    exists.should.have.been.callCount(2);
    generator.files[0].should.deep.equal({
      src: 'test/path/preprocessed.srcExtension',
      dest: 'test/path/preprocessed.extension',
      template: false
    });
    generator.files[1].should.deep.equal({
      src: 'test/path/not/preprocessed.js',
      dest: 'test/path/not/preprocessed.js',
      template: false
    });
    generator.files[3].template.should.be.true;
  });

});
