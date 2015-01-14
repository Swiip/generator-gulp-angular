
  .config <[ $stateProvider $urlRouterProvider ]> ++ ($state-provider, $url-router-provider) ->
    $state-provider
      .state 'home', do
        url: '/',
        template-url: 'app/main/main.html',
        controller: 'MainCtrl'
    $url-router-provider.otherwise '/'
