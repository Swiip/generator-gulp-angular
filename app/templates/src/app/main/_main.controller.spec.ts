import { MainController } from './main.controller';

describe('controllers', () => {

  beforeEach(angular.mock.module('gulpAngular'));

  it('should define more than 5 awesome things', inject(($controller: ng.IControllerService) => {
    const vm: MainController = $controller('MainController');

    expect(vm.awesomeThings.length > 5).toBeTruthy();
  }));
});
