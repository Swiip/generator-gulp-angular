/** @ngInject */
export function acmeNavbar(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
      creationDate: '='
    },
    templateUrl: 'app/components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'vm',
    bindToController: true
  };

}

/** @ngInject */
export class NavbarController {
  public relativeDate: string;
  // "this.creationDate" is initialized by directive option "bindToController: true"
  public creationDate: number;

  constructor(moment: moment.MomentStatic) {
    this.relativeDate = moment(this.creationDate).fromNow();
  }
}
