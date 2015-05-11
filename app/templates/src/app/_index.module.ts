/// <reference path="../../<%= props.paths.tmp %>/typings/tsd.d.ts" />

/// <reference path="main/main.controller.ts" />
/// <reference path="../app/components/navbar/navbar.controller.ts" />
/// <reference path="../app/components/malarkey/malarkey.directive.ts" />
/// <reference path="../app/components/webDevTec/webDevTec.service.ts" />
/// <reference path="../app/components/githubContributor/githubContributor.service.ts" />

declare var malarkey: any;

module <%= appName %> {
  'use strict';

  angular.module('<%= appName %>', [<%= modulesDependencies %>])
    .constant('malarkey', malarkey)
    .service('webDevTec', WebDevTecService)
    .service('githubContributor', GithubContributor)
    .directive('acmeMalarkey', acmeMalarkey)
    .controller('MainController', MainController)
    .controller('NavbarController', NavbarController);
}
