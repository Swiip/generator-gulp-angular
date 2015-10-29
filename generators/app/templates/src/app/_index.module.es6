/* global malarkey:false, moment:false */

import { config } from './index.config';
<% if (props.router.key === 'new-router') { -%>
import { routerConfig, RouterController } from './index.route';
<% } else if (props.router.key !== 'noRouter') { -%>
import { routerConfig } from './index.route';
<% } -%>
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';

angular.module('<%- appName %>', [<%- modulesDependencies %>])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
<% if (props.router.key !== 'noRouter') { -%>
  .config(routerConfig)
<% } -%>
  .run(runBlock)
  .service('githubContributor', GithubContributorService)
  .service('webDevTec', WebDevTecService)
<% if (props.router.key === 'new-router') { -%>
  .controller('RouterController', RouterController)
<% } -%>
  .controller('MainController', MainController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective);
