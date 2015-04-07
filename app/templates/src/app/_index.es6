'use strict';

import MainController from './main/main.controller';
import NavbarController from '../app/components/navbar/navbar.controller';

angular.module('<%= appName %>', [<%= modulesDependencies %>])
  .controller('MainController', MainController)
  .controller('NavbarController', NavbarController)
<%= routerJs %>;
