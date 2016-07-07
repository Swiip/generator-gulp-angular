'use strict';

<% if (props.protractorFramework.key === 'cucumber') { -%>
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
var page = require('./main.po');

chai.use(chaiAsPromised);

module.exports = function () {
  this.Given('a demo app', function (done) {
    done();
  });

  this.When('I load the page', function (done) {
    browser.get('/index.html');
    done();
  });

  this.Then(/^I should see the jumbotron with correct data$/, function () {
    expect(page.h1El.getText()).to.eventually.equal('\'Allo, \'Allo!');
    expect(page.imgEl.getAttribute('src')).to.eventually.have.string('assets/images/yeoman.png');
    return expect(page.imgEl.getAttribute('alt')).to.eventually.equal('I\'m Yeoman');
  });

  this.Then(/^I should see a list of more than (\d+) awesome things$/, function (itemNumber) {
    return expect(page.thumbnailEls.count()).to.eventually.be.at.least(itemNumber);
  });
};
<% } else { -%>
describe('The main view', function () {
  var page;

  beforeEach(function () {
    browser.get('/index.html');
    page = require('./main.po');
  });

  it('should include jumbotron with correct data', function() {
    expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
    expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
    expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
  });

  it('should list more than 5 awesome things', function () {
    expect(page.thumbnailEls.count()).toBeGreaterThan(5);
  });

});
<% } -%>

