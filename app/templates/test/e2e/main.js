'use strict';

describe('The main view', function () {

  beforeEach(function () {
    browser.get('http://localhost:3002');
  });

  it('list 2 awesome things', function () {
    expect(element.all(by.repeater('awesomeThing in awesomeThings')).count()).toBe(2);
  });

});
