angular.module "<%= appName %>"
  .config ($routeProvider) ->
    $routeProvider
      .when "/",
        templateUrl: "app/main/main.html"
        controller: "MainController"
        controllerAs: "main"
      .otherwise
        redirectTo: "/"
