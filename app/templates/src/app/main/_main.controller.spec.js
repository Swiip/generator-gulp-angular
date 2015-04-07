'use strict';

describe('controllers', function(){
  var scope;

  beforeEach(module('<%= appName %>'));

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should define more than 5 awesome things', inject(function($controller) {
<% if (props.jsPreprocessor.key === 'none' || props.jsPreprocessor.srcExtension === 'es6') { %>
    var vm = $controller('MainController', {
      $scope: scope
    });

    expect(angular.isArray(vm.awesomeThings)).toBeTruthy();
    expect(vm.awesomeThings.length > 5).toBeTruthy();
<% } else { %>
    $controller('MainController', {
      $scope: scope
    });

    expect(angular.isArray(scope.awesomeThings)).toBeTruthy();
    expect(scope.awesomeThings.length > 5).toBeTruthy();
<% }%>
  }));
});
