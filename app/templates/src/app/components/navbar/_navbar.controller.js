(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .controller('NavbarCtrl', NavbarCtrl);

  /** @ngInject */
  function NavbarCtrl() {
    var vm = this;

    vm.date = new Date();
  }
})();
