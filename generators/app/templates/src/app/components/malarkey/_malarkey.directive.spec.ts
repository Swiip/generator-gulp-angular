import { MalarkeyController } from './malarkey.directive';
import { GithubContributor } from '../githubContributor/githubContributor.service';

/**
 * @todo Complete the test
 * This example is not perfect.
 * The `link` function is not tested.
 * (malarkey usage, addClass, $watch, $destroy)
 */
describe('directive malarkey', () => {
  let element: angular.IAugmentedJQuery;
  let malarkeyController: MalarkeyController;

  beforeEach(angular.mock.module('<%- appName %>'));

  beforeEach(inject(($compile: angular.ICompileService, $rootScope: angular.IRootScopeService, githubContributor: GithubContributor, $q: angular.IQService) => {
    spyOn(githubContributor, 'getContributors').and.callFake(() => {
      return  $q.when([{}, {}, {}, {}, {}, {}]);
    });

    element = angular.element(`
      <acme-malarkey extra-values="['Poney', 'Monkey']"></acme-malarkey>
    `);

    $compile(element)($rootScope.$new());
    $rootScope.$digest();
    malarkeyController = (<any> element.isolateScope()).vm;
  }));

  it('should be compiled', () => {
    expect(element.html()).not.toEqual(null);
  });

  it('should have isolate scope object with instanciate members', () => {
    expect(malarkeyController).toEqual(jasmine.any(Object));

    expect(malarkeyController.contributors.length).toEqual(6);
  });

  it('should log a info', inject(($log: angular.ILogService) => {
    expect($log.info.logs).toEqual(jasmine.stringMatching('Activated Contributors View'));
  }));
});
