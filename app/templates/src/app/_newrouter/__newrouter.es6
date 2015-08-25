export function routerConfig($componentLoaderProvider) {
  'ngInject';
  $componentLoaderProvider.setTemplateMapping(function(name) {
    return `app/${ name }/${ name }.html`;
  });
}

export class RouterController {
  constructor($router) {
    'ngInject';
    $router.config([
      { path: '/', component: 'main' }
    ]);
  }
}
