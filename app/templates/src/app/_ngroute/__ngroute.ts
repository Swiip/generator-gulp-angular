module <%= appName %> {
  'use strict';

  export class RouterConfig {
    /** @ngInject */
    constructor($routeProvider: ng.route.IRouteProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'app/main/main.html',
          controller: 'MainController',
          controllerAs: 'main'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  }
}
