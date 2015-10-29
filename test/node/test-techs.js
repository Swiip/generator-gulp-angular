'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Generator = require('./mock-generator');
var generator;

var techs = require('../../generators/app/src/techs.js');
var techsJson = require('../../generators/app/techs.json');

describe('gulp-angular generator techs script', function () {

  before(function () {
    techs(Generator);
    techsJson['tech-name-1'] = { logo: 'logo-name-1' };
    techsJson['tech-name-2'] = { logo: 'logo-name-2' };
  });

  after(function () {
    delete techsJson['tech-name-1'];
    delete techsJson['tech-name-2'];
  });

  beforeEach(function () {
    generator = new Generator();
  });

  it('should add tech logo copies and prepare json definition', function () {
    generator.props = {
      jQuery: { name: 'tech-name-1' },
      ui: { key: 'tech-name-2' },
      bootstrapComponents: { key: null },
      foundationComponents: { key: 'noFoundationComponents' },
      cssPreprocessor: { extension: 'default' },
      jsPreprocessor: { extension: 'css' },
      htmlPreprocessor: { extension: 'official' }
    };
    generator.files = [];
    generator.computeTechs();
    generator.technologies.should.match(/logo-name-1/);
    generator.technologies.should.match(/logo-name-2/);
    generator.files[generator.files.length - 2].src.should.match(/logo-name-1/);
    generator.files[generator.files.length - 1].src.should.match(/logo-name-2/);
  });

});
