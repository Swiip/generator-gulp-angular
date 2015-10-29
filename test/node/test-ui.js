'use strict';

var chai = require('chai');
chai.should();

var Generator = require('./mock-generator');
var generator;

var ui = require('../../generators/app/src/ui.js');

describe('gulp-angular generator ui script', function () {

  before(function () {
    ui(Generator);
  });

  beforeEach(function () {
    generator = new Generator();
  });

  describe('add right files depending choices', function () {
    it('should add only navbar and index.scss for no router and no ui', function () {
      generator.props = {
        router: { module: null },
        ui: { key: 'noUI' },
        cssPreprocessor: { key: 'noCssPrepro', extension: 'css' }
      };
      generator.files = [];
      generator.uiFiles();
      generator.files[0].src.should.be.equal('src/app/components/navbar/__noUI-navbar.html');
      generator.files[1].src.should.be.equal('src/app/_noUI/__noUI-index.css');
      generator.files[2].src.should.be.equal('src/app/components/malarkey/__malarkey.css');
      generator.files[3].src.should.be.equal('src/app/components/navbar/__navbar.css');
      generator.files.length.should.be.equal(4);
    });

    it('should add 6 files when all options', function () {
      generator.props = {
        router: { module: 'ngRoute' },
        ui: { key: 'bootstrap' },
        cssPreprocessor: { key: 'notnone', extension: 'scss' }
      };
      generator.files = [];
      generator.uiFiles();
      generator.files[0].src.should.be.equal('src/app/components/navbar/__bootstrap-navbar.html');
      generator.files[1].src.should.be.equal('src/app/main/__bootstrap.html');
      generator.files[2].src.should.be.equal('src/app/_bootstrap/__bootstrap-index.scss');
      generator.files[3].src.should.be.equal('src/app/components/malarkey/__malarkey.scss');
      generator.files[4].src.should.be.equal('src/app/components/navbar/__navbar.scss');
      generator.files.length.should.be.equal(5);
    });
  });

});
