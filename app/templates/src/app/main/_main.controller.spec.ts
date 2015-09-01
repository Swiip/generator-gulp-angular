/**
 * @todo Write test in TypeScript
 */
describe('controllers', () => {

  beforeEach(angular.mock.module('<%- appName %>'));

  it('should define more than 5 awesome things', inject(($controller: ng.IControllerService) => {
    var vm = $controller('MainController');

    expect(angular.isArray(vm.awesomeThings)).toBeTruthy();
    expect(vm.awesomeThings.length > 5).toBeTruthy();
  }));
});
