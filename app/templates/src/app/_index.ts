/// <reference path="../../bower_components/dt-angular/angular.d.ts" />

'use strict';

module <%= appName %> {
  angular.module('<%= appName %>', [<%= modulesDependencies %>])
    .controller('MainCtrl', MainCtrl)
    .controller('NavbarCtrl', NavbarCtrl)
    <%= routerJs %>;
}
