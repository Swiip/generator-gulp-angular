(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .controller('NavbarCtrl', NavbarCtrl);

  function NavbarCtrl() {
    var vm = this;
    vm.date = new Date();
  }
})();
