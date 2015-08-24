(function() {
  'use strict';

  /**
   * @todo Complete the test
   * This example is not perfect.
   * Test should check if MomentJS have been called
   */
  describe('directive navbar', function() {
    // var $window;
    var vm;
    var el;
    var timeInMs;

    beforeEach(module('<%- appName %>'));
    beforeEach(inject(function($compile, $rootScope) {
      // spyOn(_$window_, 'moment').and.callThrough();
      // $window = _$window_;

      timeInMs = new Date();
      timeInMs = timeInMs.setHours(timeInMs.getHours() - 24);

      el = angular.element('<acme-navbar creation-date="' + timeInMs + '"></acme-navbar>');

      $compile(el)($rootScope.$new());
      $rootScope.$digest();
      vm = el.isolateScope().vm;
      // ctrl = el.controller('acmeNavbar');
    }));

    it('should be compiled', function() {
      expect(el.html()).not.toEqual(null);
    });

    it('should have isolate scope object with instanciate members', function() {
      expect(vm).toEqual(jasmine.any(Object));

      expect(vm.creationDate).toEqual(jasmine.any(Number));
      expect(vm.creationDate).toEqual(timeInMs);

      expect(vm.relativeDate).toEqual(jasmine.any(String));
      expect(vm.relativeDate).toEqual('a day ago');
    });

    // it('should call Moment', function() {
    //   console.log($window.moment)
    //   expect($window.moment).toHaveBeenCalled();
    // });
  });
})();
