import MainController from './main/main.controller';
import NavbarController from '../app/components/navbar/navbar.controller';
import WebDevTecService from '../app/components/webDevTec/webDevTec.service';

angular.module('<%= appName %>', [<%= modulesDependencies %>])
  .controller('MainController', MainController)
  .controller('NavbarController', NavbarController)
  .service('webDevTec', WebDevTecService)
<%= routerJs %>;
