angular.module "<%= appName %>"
  .controller "MainController", () ->
    vm = this
    vm.awesomeThings = <%= technologies %>
    angular.forEach vm.awesomeThings, (awesomeThing) ->
      awesomeThing.rank = Math.random()
    return
