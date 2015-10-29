angular.module '<%- appName %>'
  .config ($componentLoaderProvider) ->
    'ngInject'
    $componentLoaderProvider.setTemplateMapping (name) ->
      "app/#{ name }/#{ name }.html"

  .controller 'RouterController', ($router) ->
    'ngInject'
    $router.config [
      path: '/'
      component: 'main'
    ]
