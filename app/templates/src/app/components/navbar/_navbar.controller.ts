module <%= appName %> {
  'use strict';

  interface INavbarScope extends ng.IScope {
    date: Date
  }

  export class NavbarController {
    /* @ngInject */
    constructor ($scope: INavbarScope) {
      $scope.date = new Date();
    }
  }

}
