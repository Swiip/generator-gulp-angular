/* global malarkey:false, toastr:false, moment:false */
import config from './index.config';
import routerConfig from './index.route';
import runBlock from './index.run';
import MainController from './main/main.controller';
import GithubApiService from '../app/components/githubApi/githubAPI.service';
import WebDevTecService from '../app/components/webDevTec/webDevTec.service';
import NavbarDirective from '../app/components/navbar/navbar.directive';
import MalarkeyDirective from '../app/components/malarkey/malarkey.directive';

angular.module('<%= appName %>', [<%= modulesDependencies %>])
  .constant('malarkey', malarkey)
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('githubApi', GithubApiService)
  .service('webDevTec', WebDevTecService)
  .controller('MainController', MainController)
  .directive('acmeNavbar', () => new NavbarDirective())
  .directive('acmeMalarkey', () => new MalarkeyDirective(malarkey));
