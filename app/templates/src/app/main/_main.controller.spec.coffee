describe 'controllers', ->
  beforeEach module('<%- appName %>')
  it 'should define more than 5 awesome things', inject(($controller) ->
    vm = $controller('MainController')
    expect(angular.isArray(vm.awesomeThings)).toBeTruthy()
    expect(vm.awesomeThings.length > 5).toBeTruthy()
  )
