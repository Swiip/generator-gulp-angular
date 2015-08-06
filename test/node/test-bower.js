'use strict';

var chai = require('chai');
chai.should();
var expect = chai.expect;

var Generator = require('./mock-generator');
var generator;

var bower = require('../../app/src/bower.js');

describe('gulp-angular generator bower script', function () {

  before(function() {
    bower(Generator);
  });

  beforeEach(function() {
    generator = new Generator();
  });

  describe('select bower overrides depending the choices', function () {
    function allFonts(array) {
      array.forEach(function(line) {
        line.should.match(/\.(eot|svg|ttf|woff|woff2)$/);
      });
    }

    it('should return null if bootstrap is not selected', function() {
      generator.props = {
        ui: { key: 'notbootstrap' }
      };
      generator.prepareBowerOverrides();
      expect(generator.bowerOverrides).to.be.null;
    });

    it('should add fonts and js for bootstrap and official js', function() {
      generator.props = {
        ui: { key: 'bootstrap' },
        bootstrapComponents: { key: 'official' },
        cssPreprocessor: { key: 'something' }
      };
      generator.prepareBowerOverrides();
      var bootstrapMain = JSON.parse(generator.bowerOverrides).bootstrap.main;
      var first = bootstrapMain.shift();
      first.should.match(/bootstrap\.js/);
      allFonts(bootstrapMain);
    });

    it('should add fonts and css for bootstrap and no css prepro', function() {
      generator.props = {
        ui: { key: 'bootstrap' },
        bootstrapComponents: { key: 'something' },
        cssPreprocessor: { key: 'none' }
      };
      generator.prepareBowerOverrides();
      var bootstrapMain = JSON.parse(generator.bowerOverrides).bootstrap.main;
      var first = bootstrapMain.shift();
      first.should.match(/bootstrap\.css/);
      allFonts(bootstrapMain);
    });

    it('should add fonts and css for bootstrap and less as css prepro', function() {
      generator.props = {
        ui: { key: 'bootstrap' },
        bootstrapComponents: { key: 'something' },
        cssPreprocessor: { key: 'less' }
      };
      generator.prepareBowerOverrides();
      var bootstrapMain = JSON.parse(generator.bowerOverrides).bootstrap.main;
      var first = bootstrapMain.shift();
      first.should.match(/bootstrap\.less/);
      allFonts(bootstrapMain);
    });

    it('should keep indent in bower.json', function() {
      generator.props = {
        ui: { key: 'bootstrap' },
        bootstrapComponents: { key: 'something' },
        cssPreprocessor: { key: 'something' }
      };
      generator.prepareBowerOverrides();
      generator.bowerOverrides.should.match(/^{.*\n {4}/);
    });
  });

  describe('select wiredep exclusions depending the choices', function () {
    it('should exclude bootstrap if angular-boostrap and scss', function() {
      generator.props = {
        jQuery: { key: 'jquery1' },
        ui: { key: 'bootstrap' },
        bootstrapComponents: { key: 'angular-bootstrap' },
        cssPreprocessor: { extension: 'scss' }
      };
      generator.computeWiredepExclusions();
      generator.wiredepExclusions[0].should.be.equal('/bootstrap\.js$/');
      generator.wiredepExclusions[1].should.be.equal('/bootstrap-sass\\/.*\\.js/');
      generator.wiredepExclusions[2].should.be.equal('/bootstrap\\.css/');
    });

    it('should exclude only bootstrap.js if angular-boostrap and less', function() {
      generator.props = {
        jQuery: { key: 'jquery1' },
        ui: { key: 'bootstrap' },
        bootstrapComponents: { key: 'angular-bootstrap' },
        cssPreprocessor: { extension: 'less' }
      };
      generator.computeWiredepExclusions();
      generator.wiredepExclusions[0].should.be.equal('/bootstrap\.js$/');
      generator.wiredepExclusions[1].should.be.equal('/bootstrap\\.css/');
    });

    it('should exclude foundation if foundation and sass', function() {
      generator.props = {
        jQuery: { key: 'jquery1' },
        ui: { key: 'foundation' },
        foundationComponents: { key: 'angular-foundation' },
        cssPreprocessor: { extension: 'scss' }
      };
      generator.computeWiredepExclusions();
      generator.wiredepExclusions[0].should.be.equal('/foundation\\.js/');
      generator.wiredepExclusions[1].should.be.equal('/foundation\\.css/');
    });

    it('should exclude foundation if foundation and not sass', function() {
      generator.props = {
        jQuery: { key: 'jquery1' },
        ui: { key: 'foundation' },
        foundationComponents: { key: 'angular-foundation' },
        cssPreprocessor: { extension: 'notscss' }
      };
      generator.computeWiredepExclusions();
      generator.wiredepExclusions[0].should.be.equal('/foundation\\.js/');
    });

    it('should exclude nothing if no ui', function() {
      generator.props = {
        jQuery: { key: 'jquery1' },
        ui: { key: 'none' }
      };
      generator.computeWiredepExclusions();
      generator.wiredepExclusions.length.should.be.equal(0);
    });

    it('should exclude nothing if bootstrap but nothing else', function() {
      generator.props = {
        jQuery: { key: 'jquery1' },
        ui: { key: 'bootstrap' },
        bootstrapComponents: { key: 'official' },
        cssPreprocessor: { key: 'none' }
      };
      generator.computeWiredepExclusions();
      generator.wiredepExclusions.length.should.be.equal(0);
    });

    it('should exclude nothing if foundation but nothing else', function() {
      generator.props = {
        jQuery: { key: 'jquery1' },
        ui: { key: 'foundation' },
        foundationComponents: { key: 'official' },
        cssPreprocessor: { key: 'none' }
      };
      generator.computeWiredepExclusions();
      generator.wiredepExclusions.length.should.be.equal(0);
    });

    it('should exclude jQuery if select "None"', function() {
      generator.props = {
        jQuery: { key: 'none' },
        ui: { key: 'foundation' },
        foundationComponents: { key: 'official' },
        cssPreprocessor: { key: 'none' }
      };
      generator.computeWiredepExclusions();
      generator.wiredepExclusions[0].should.be.equal('/jquery/');
    });

    it('should exclude jQuery with Zepto', function() {
      generator.props = {
        jQuery: { key: 'zepto' },
        ui: { key: 'foundation' },
        foundationComponents: { key: 'official' },
        cssPreprocessor: { key: 'none' }
      };
      generator.computeWiredepExclusions();
      generator.wiredepExclusions[0].should.be.equal('/jquery/');
    });
  });

});
