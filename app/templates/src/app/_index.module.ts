/// <reference path="../../<%= props.paths.tmp %>/typings/tsd.d.ts" />

/// <reference path="main/main.controller.ts" />
/// <reference path="../app/components/navbar/navbar.controller.ts" />
/// <reference path="../app/components/webDevTec/webDevTec.service.ts" />

module <%= appName %> {
  'use strict';

  angular.module('<%= appName %>', [<%= modulesDependencies %>])
    .controller('MainController', MainController)
    .controller('NavbarController', NavbarController)
    .service('webDevTec', WebDevTecService)
<%= routerJs %>;
}
