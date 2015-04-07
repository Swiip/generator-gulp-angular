
  .config ($routeProvider) ->
    $routeProvider
      .when "/",
        templateUrl: "app/main/main.html"
        controller: "MainController"
      .otherwise
        redirectTo: "/"
