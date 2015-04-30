/* global malarkey:false */
import MainController from './main/main.controller';
import NavbarController from '../app/components/navbar/navbar.controller';
import WebDevTecService from '../app/components/webDevTec/webDevTec.service';

angular.module('<%= appName %>', [<%= modulesDependencies %>])
  .constant('malarkey', malarkey)
  .controller('MainController', MainController)
  .controller('NavbarController', NavbarController)
  .service('webDevTec', WebDevTecService)
<%= routerJs %>;
