class MalarkeyDirective {
  constructor (malarkey) {
    'ngInject';

    let directive = {
      restrict: 'E',
      scope: {
          extraValues: '='
      },
      template: '<span></span>',
      link: linkFunc,
      controller: MalarkeyController,
      controllerAs: 'vm'
    };

    return directive;

    function linkFunc(scope, el, attr, vm) {
      let watcher;
      let typist = malarkey(el[0], {
        typeSpeed: 40,
        deleteSpeed: 40,
        pauseDelay: 800,
        loop: true,
        postfix: ' '
      });

      el.addClass('acme-malarkey');

      angular.forEach(scope.extraValues, (value) => {
        typist.type(value).pause().delete();
      });

      watcher = scope.$watch('vm.contributors', () => {
        angular.forEach(vm.contributors, (contributor) => {
          typist.type(contributor.login).pause().delete();
        });
      });

      scope.$on('$destroy', () => {
        watcher();
      });
    }

  }
}

class MalarkeyController {
  constructor ($log, githubContributor) {
    'ngInject';

    let vm = this;

    vm.contributors = [];

    activate();

    function activate() {
      return getContributors().then(() => {
        $log.info('Activated Contributors View');
      });
    }

    function getContributors() {
      return githubContributor.getContributors(10).then((data) => {
        vm.contributors = data;

        return vm.contributors;
      });
    }
  }
}

export default MalarkeyDirective;
