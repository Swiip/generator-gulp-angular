(function() {
  'use strict';

  angular
    .module('<%= appName %>')
    .directive('acmeMalarkey', acmeMalarkey);

  /** @ngInject */
  function acmeMalarkey(malarkey) {
    return {
      restrict: 'E',
      scope: {
        extraValues: '=',
      },
      template: '<div></div>',
      link: linkFunc,
      controller: 'MalarkeyController',
      controllerAs: 'vm'
    };
  }

  function linkFunc(scope, el, attr, vm) {
    var watcher;
    var typist = malarkey(el[0], {
      typeSpeed: 40,
      deleteSpeed: 40,
      pauseDelay: 800,
      loop: true,
      postfix: ' '
    });

    angular.forEach(scope.extraValues, function(value) {
      typist.type(value).pause().delete();
    });

    watcher = scope.$watch('vm.contributors', function(current, original) {
      angular.forEach(vm.contributors, function(contributor) {
        typist.type(contributor.login).pause().delete();
      });
    });

    scope.$on('$destroy', watcher);
  }

})();
