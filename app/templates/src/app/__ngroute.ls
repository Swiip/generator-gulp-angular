
  .config <[ $routeProvider ]> ++ ($route-provider) ->
    $route-provider
      .when '/', do
        template-url: 'app/main/main.html',
        controller: 'MainCtrl'
      .otherwise do
        redirect-to: '/'
