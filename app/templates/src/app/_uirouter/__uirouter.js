
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl as main'
      });

    $urlRouterProvider.otherwise('/');
  }
