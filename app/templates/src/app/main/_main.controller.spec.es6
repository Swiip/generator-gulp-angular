(function() {
  'use strict';

  /**
   * @todo Write test in ES6
   */
  describe('controllers', function(){

    beforeEach(angular.mock.module('<%- appName %>'));

    it('should define more than 5 awesome things', inject(function($controller) {
      var vm = $controller('MainController');

      expect(angular.isArray(vm.awesomeThings)).toBeTruthy();
      expect(vm.awesomeThings.length > 5).toBeTruthy();
    }));
  });
})();
