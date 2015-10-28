/** @ngInject */
export function routerConfig($componentLoaderProvider: any) {
  $componentLoaderProvider.setTemplateMapping(function(name: String) {
    return 'app/' + name + '/' + name + '.html';
  });
}

/** @ngInject */
export class RouterController {
  constructor($router: any) {
    $router.config([
      { path: '/', component: 'main' }
    ]);
  }
}
