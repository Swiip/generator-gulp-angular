export function routerConfig($componentLoaderProvider) {
  $componentLoaderProvider.setTemplateMapping(function(name) {
    return 'app/' + name + '/' + name + '.html';
  });
}

export class RouterController {
  constructor($router) {
    $router.config([
      { path: '/', component: 'main' }
    ]);
  }
}
