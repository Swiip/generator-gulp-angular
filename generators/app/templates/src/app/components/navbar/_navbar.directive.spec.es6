/**
 * @todo Complete the test
 * This example is not perfect.
 * Test should check if MomentJS have been called
 */
describe('directive navbar', function() {
  let vm;
  let element;
  let timeInMs;

  beforeEach(angular.mock.module('<%- appName %>'));

  beforeEach(inject(($compile, $rootScope) => {
    const currentDate = new Date();
    timeInMs = currentDate.setHours(currentDate.getHours() - 24);

    element = angular.element(`
      <acme-navbar creation-date="${timeInMs}"></acme-navbar>
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

    expect(vm.creationDate).toEqual(jasmine.any(Number));
    expect(vm.creationDate).toEqual(timeInMs);

    expect(vm.relativeDate).toEqual(jasmine.any(String));
    expect(vm.relativeDate).toEqual('a day ago');
  });
});
