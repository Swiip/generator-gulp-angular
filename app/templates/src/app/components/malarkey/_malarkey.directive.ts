/// <reference path="./malarkey.controller.ts" />

module <%= appName %> {
  'use strict';

  interface IProjectsScope extends ng.IScope {
    extraValues: any[];
  }

  /** @ngInject */
  export function acmeMalarkey(malarkey: any): ng.IDirective {

    return {
      restrict: 'E',
      scope: {
        extraValues: '='
      },
      template: '<div></div>',
      link: linkFunc,
      controller: MalarkeyController,
      controllerAs: 'vm'
    };

  }

  function linkFunc(scope: IProjectsScope, el: JQuery, attr: any, vm: MalarkeyController) {
    var watcher;
    var typist = malarkey(el[0], {
      typeSpeed: 40,
      deleteSpeed: 40,
      pauseDelay: 800,
      loop: true,
      postfix: ' '
    });

    angular.forEach(scope.extraValues, function(value: string) {
      typist.type(value).pause().delete();
    });

    watcher = scope.$watch('vm.contributors', function(current: IContributor, original: IContributor) {
      angular.forEach(vm.contributors, function(contributor: IContributor) {
        typist.type(contributor.login).pause().delete();
      });
    });

    scope.$on('$destroy', function () {
      watcher();
    });
  }

}
