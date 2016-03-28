# Use spritesheets

## [#737](https://github.com/Swiip/generator-gulp-angular/issues/737)

As your app becomes bigger, you might like to extract some parts of it into separate sub-modules.
In order to accomplish that you need to:

Define a module (i.e. `app/splash/`):

```js
import SplashController from './splash.controller';
import router from './splash.routes';

export default angular.module('client.splash', [
    'ngAnimate',
    'ngTouch',
    'ngSanitize',
    'ui.router',
])
    .config(router)
    .controller('SplashController', SplashController)
;
```

Then import it for use in your primary module (`index.module.js`):

```js
import constants from './components/constants/env.constant';
import indexConfig from './index.config';
import routerConfig from './index.route';
import runBlock from './index.run';

// Modules
import './splash';
// ... etc

angular.module('client', [
    'ngAnimate',
    'ngTouch',
    'ngSanitize',
    'ui.router',
    'angularMoment',
    'client.splash',
    // .... etc
])
    .config(indexConfig)
    .constant('ENV', constants.ENV)
    .config(routerConfig)
    .run(runBlock)
;
```

