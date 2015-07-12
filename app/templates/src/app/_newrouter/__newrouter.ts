module <%- appName %> {
  'use strict';

  /** @ngInject */
  export function routerConfig($componentLoaderProvider) {
    $componentLoaderProvider.setTemplateMapping(function(name) {
      return 'app/' + name + '/' + name + '.html';
    });
  }

  /** @ngInject */
  export class RouterController {
    constructor($router) {
      $router.config([
        { path: '/', component: 'main' }
      ]);
    }
  }
}
