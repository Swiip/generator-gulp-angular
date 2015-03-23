/// <reference path="../../<%= props.paths.tmp %>/typings/tsd.d.ts" />

/// <reference path="main/main.controller.ts" />
/// <reference path="../app/components/navbar/navbar.controller.ts" />

module <%= appName %> {
  'use strict';

  angular.module('<%= appName %>', [<%= modulesDependencies %>])
    .controller('MainCtrl', MainCtrl)
    .controller('NavbarCtrl', NavbarCtrl)
<%= routerJs %>;
}
