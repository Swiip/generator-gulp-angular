    function configRoute($routeProvider) {
        $routeProvider
          .when('/', {
            templateUrl: 'app/main/main.html',
            controller: 'MainCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
    }
