'use strict';
describe('Controller: <%= scriptClassName %>Ctrl', function () {
// load the controller's module
  beforeEach(module('<%= scriptAppName %>'));
  var <%= scriptClassName %>Ctrl,
      scope;
// Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    <%= scriptClassName %>Ctrl = $controller('<%= scriptClassName %>Ctrl', {
      $scope: scope
    });
  }));
  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
