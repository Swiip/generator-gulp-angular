(function() {
  'use strict';

  /**
   * @todo Complete the test
   * This example is not perfect.
   * The `link` function is not tested.
   * (malarkey usage, addClass, $watch, $destroy)
   */
  describe('directive malarkey', function() {
    var $log;
    var vm;
    var el;

    beforeEach(module('<%- appName %>'));
    beforeEach(inject(function($compile, $rootScope, githubContributor, $q, _$log_) {
      $log = _$log_;

      spyOn(githubContributor, 'getContributors').and.callFake(function() {
        return $q.when([{}, {}, {}, {}, {}, {}]);
      });

      el = angular.element('<acme-malarkey extra-values="[\'Poney\', \'Monkey\']"></acme-malarkey>');

      $compile(el)($rootScope.$new());
      $rootScope.$digest();
      vm = el.isolateScope().vm;
    }));

    it('should be compiled', function() {
      expect(el.html()).not.toEqual(null);
    });

    it('should have isolate scope object with instanciate members', function() {
      expect(vm).toEqual(jasmine.any(Object));

      expect(vm.contributors).toEqual(jasmine.any(Array));
      expect(vm.contributors.length).toEqual(6);
    });

    it('should log a info', function() {
      expect($log.info.logs).toEqual(jasmine.stringMatching('Activated Contributors View'));
    });
  });
})();
