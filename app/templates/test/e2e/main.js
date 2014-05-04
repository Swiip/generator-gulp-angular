'use strict';

describe('The main view', function(){

  beforeEach(function() {
    browser.get('http://localhost:9000');
  });

  it('list 3 awesome things', function() {
    expect(element.all(by.repeater('awesomeThing in awesomeThings')).count()).toBe(3);
  });

});
