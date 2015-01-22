    function configRoute($routeProvider: ng.route.IRouteProvider) {
        $routeProvider
          .when('/', {
            templateUrl: 'app/main/main.html',
            controller: 'MainCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
    }