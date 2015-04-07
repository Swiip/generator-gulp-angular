
  .config(function ($routeProvider: ng.route.IRouteProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
