class NavbarDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  }
}

class NavbarController {
  constructor (moment) {
    'ngInject';

    let vm = this;

    // "vm.creation" is avaible by directive option "bindToController: true"
    vm.relativeDate = moment(vm.creationDate).fromNow();
  }
}

export default NavbarDirective;
