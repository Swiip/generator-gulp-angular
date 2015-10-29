/**
 * @todo Complete the test
 * This example is not perfect.
 * The `link` function is not tested.
 * (malarkey usage, addClass, $watch, $destroy)
 */
describe('directive malarkey', function() {
  let vm;
  let element;

  beforeEach(angular.mock.module('<%- appName %>'));

  beforeEach(inject(($compile, $rootScope, githubContributor, $q) => {
    spyOn(githubContributor, 'getContributors').and.callFake(() => {
      return $q.when([{}, {}, {}, {}, {}, {}]);
    });

    element = angular.element(`
      <acme-malarkey extra-values="['Poney', 'Monkey']"></acme-malarkey>
    `);

    $compile(element)($rootScope.$new());
    $rootScope.$digest();
    vm = element.isolateScope().vm;
  }));

  it('should be compiled', () => {
    expect(element.html()).not.toEqual(null);
  });

  it('should have isolate scope object with instanciate members', () => {
    expect(vm).toEqual(jasmine.any(Object));

    expect(vm.contributors).toEqual(jasmine.any(Array));
    expect(vm.contributors.length).toEqual(6);
  });

  it('should log a info', inject($log => {
    expect($log.info.logs).toEqual(jasmine.stringMatching('Activated Contributors View'));
  }));
});
