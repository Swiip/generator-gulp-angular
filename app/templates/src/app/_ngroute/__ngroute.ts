module <%- appName %> {
  'use strict';

  /** @ngInject */
  export function RouterConfig($routeProvider: ng.route.IRouteProvider) {
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
