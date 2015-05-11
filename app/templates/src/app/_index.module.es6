/* global malarkey:false */
import MainController from './main/main.controller';
import NavbarDirective from '../app/components/navbar/navbar.directive';
import WebDevTecService from '../app/components/webDevTec/webDevTec.service';

angular.module('<%= appName %>', [<%= modulesDependencies %>])
  .constant('malarkey', malarkey)
  .controller('MainController', MainController)
  .directive('acmeNavbar', NavbarDirective)
  .service('webDevTec', WebDevTecService);
