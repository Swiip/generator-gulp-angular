## User Guide

You've just generated a brand new project which is full of useful features, here's an introduction to what you have.

## Yeoman Workflow

We're proud to say that this generator follows the Yeoman generator guidelines by the book.

### `serve`

For the development phase, the command `gulp serve` launches a server which supports live reload of your modifications.

Its usage is described in the chapters [Development server](#development-server) and [File watching & pre-processing](#file-watching--pre-processing)

### `test`

For testing, a fully working test environment is shipped with some examples. It uses Karma (with `gulp test`) for the unit tests, and Protractor for the end-to-end tests (with `gulp protractor`).

More information in the [Test environment configured](#test-environment-configured) chapter.

### `build`

The generator brings a state of the art optimization process with the command `gulp build` or simply `gulp`. It's fully described in the [Optimization process](#optimization-process) chapter.

### `inject`

This generator goes further than the Yeoman guidelines by shipping a fully working file injection process which is able to automatically write all of your `script` and `link` tags in your `index.html`

All the details about how to use injection are in the [File injection](#file-injection) chapter.

## Development server

The generator is shipped with the awesome [Browser Sync](http://www.browsersync.io/) as the development server.

The recommended development process is to serve your web resources locally to be more reactive and be able to have features like automatic reload of your page when you make a modification.

If you have a backend server to address, keep the development server and either:
  - launch your request with complete URLs (but you'll have to handle [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing))
  - or you can use the embedded proxy feature which can redirect your request from the development server to your backend transparently without dealing with CORS.

### Serve you `src` folder

Browser Sync is configured to serve your `src` folder. Or at least all the files not transformed in `src`.

For the pre-processed files (depending of your options, could be all your files), Browser Sync is configured to also serve the `.tmp/serve` folder.

With the [file watching and pre-processing](#file-watching--pre-processing) feature, your files will be automatically processed and put in the `.tmp/serve` folder. This process should be transparent.

If the same file is in both directories, the one in `.tmp/serve` will be chosen.

Finally, your `bower_components` folder, which contains your external dependencies from Bower (and is not located inside the `src` folder), will be served with the `bower_components` alias at the root of the server.

### Live reload of your sources

When you launch your dev. server with `gulp serve`, it will launch Browser Sync along with the [file watching and pre-processing](#file-watching--pre-processing) feature.

When gulp detects a change, it will send a reload command to Browser Sync. Depending on which files have changed (html/js or css) it will reload the whole page or just reload the css and keep your page context up.

### The proxy feature

As mentioned in the introduction, it's considered a good process to keep using the dev server even if you also have a backend running on your computer.

At this point, your application will have to launch requests both to request static files of the front end project, and dynamic routes of your backend.

The cleaner way to address this need is to add a proxy feature to the Browser Sync server. This feature is inactive by default as we can't know about your backend configuration, but it's in the comments and easy to start. Look in `gulp/server.js`, you've got a line in the comments:
```javascript
server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});
```

Replace the parameters with your needs, relaunch the server, and you should be able to target your backend through Browser Sync's domain and port.

If you want more detail about the proxy middleware, look at the external lib which provides the feature: https://github.com/chimurai/http-proxy-middleware

## File watching & pre-processing

When you run the dev. server or if you manually launch the `watch` task, Gulp will watch your changes on the files in the `src` folder. This enables Gulp to launch all processings on your file as soon as you hit save.

All processings are watching your `src` directory and put their results in the `.tmp/serve` folder. **There is no automatic process featured in the generator which will modify your files in the `src` folder**. The processed version of the files are written at the same path as the original file with often a new file extension.

There are 4 processings featured in the generator:
- **Injection** (`gulp/inject.js`): When you put any files ending by `.js` or `.css` in your `src` folder or when you add a Bower dependency, it will rewrite a new `index.html`, more information in the [file injection chapter](#file-injection)
- **Scripts** (`gulp/scripts.js`): If you choose a script pre-processor, all modification or creation on your files matching the extension of your pre-processor will trigger a recompile.
- **Styles** (`gulp/styles`): If you choose a CSS pre-procesor, all modification or creation on your files matching the extension of your pre-processor will trigger a recompile.
- **Markups** (`gulp/markups`): If you choose an HTML pre-procesor, all modification or creation on your files matching the extension of your pre-processor will trigger a recompile.

**Warning**: The generator uses the file watching from Gulp 3 which is known to have some limitations. For example a new directory or the creation of the first file in a directory will be missed. Please try to stop your watch process and relaunch it before asking for help.

There are gulp plugins to address this problem but we agreed on staying as it is waiting for the release of Gulp 4 which will fix these problems

## File injection

If you open your generated `index.html` you'll see that it's full of comments and that there is no (or very few) `script` and `link` tags.

It's because this generator has an automatic process which will write them for you. It will not rewrite your `src/index.html` as it would be changing your sources. It will put the **injected** version in the `.tmp/serve` folder.

There is two types of file injection which will be performed, the injection of your external dependencies from Bower and the injection of your source files discovered in the `src` folder.

### Bower dependencies

An external tool called [Wiredep](https://github.com/taptapship/wiredep) is used in the generated project to list the Bower dependencies and inject them in the index.html.

You have to notice that in order to work correctly, your Bower dependencies should be listed in the `bower.json`, installed in the `bower_components` folder and contains a `bower.json` of their own listing the files to include in the property `main`.

A dependency wrongly installed or which doesn't link properly the files to include in its `bower.json` (not yours, the one of the lib) will not be injected properly. If this appens, you have a way to include manually files described in the chapter [Manual injection](#manual-injection).

### Your source code

The generator is also abled to automatically write the `script` and `link` tags for your own source files. To do that, it looks through the whole content of the `src` folder and inject all the files in the `index.html`.

As the order of the files are important in JavaScript, the order is not chosen randomly. We use a script called [Angular FileSort](https://github.com/klei/gulp-angular-filesort) which will analyse your source code and reorder your files respecting the dependencies discovered through the Angular modules.

For the CSS, the order is not important. Unfortunately for the CSS pre-processors the order does matters but we don't have any ordering feature to solve the issue. The only element we can give is that the order is not random but depends on the folder structure and the file names and in most of the case it's possible to find a structure which will assure the files to be loaded in the right order.

### CSS pre-processor injection

When you use a CSS pre-processor, the inject process for your style files is a bit different. It's in the pre-processor file that you want the injection and not in the `injex.html` and it's what the injection will do.

In this special case, the "injection" will not be performed in the `inject` task or in the `index.html` file but directly in the `styles` task. You'll find comments in your `index.(scss|less|styl)` file which locate the position to add include statements with the syntax of the pre-processor.

Bower support linking dependency of CSS preprocessed files, the generated project take advantage of it and will be able to add include statements of your dependencies if they are defined properly in the bower description file of your library.

### Manual injection

We do all that we can for the process of automatic injection to be as transparent as possible and works as you could imagine it will when you modify your project.

Unfortunately there is always cases where the right inclusions are not done automatically. The most common case is the Bower dependency which doesn't defines the right files to include in its own descriptor.

It could not be obvious at the first look at the `src/index.html` you are still allowed to put your own `script` or `link` tag and load whatever you want! The key to do it right is to put your tags in the right place.

In the `index.html` file, you'll find two types of comments, some for the build process like `<!-- build:js(src) scripts/vendor.js -->` and some for the injection process like `<!-- bower:js -->` or `<!-- inject:js -->`. You'll see that injections comments are always put inside build ones because we want the inclusions to be made where the optimization process will be able to find them.

**The key is to put your tags inside the build blocks to be part of the optimization process but outside of the inject blocks which will be overriden**.

*Example*:
```html
    <!-- build:css({.tmp/serve,src}) styles/vendor.css -->
    <link rel="stylesheet" href="../custom-theme/style.css">
    <!-- bower:css -->
    <!-- run `gulp inject` to automatically populate bower styles dependencies -->
    <!-- endbower -->
    <!-- endbuild -->
```

Note, that the `custom-theme` folder also needs to be added to `gulp/server.js:browserSyncInit`'s list of routes. Otherwise, it won't be loaded via server.

## Test environment configured

One of the goals of the generator is to bring to you a test environment already configured so you have only to write your tests.

As it is today the guideline, the tests files are placed directly in the source folder next to the file you want to test. The distinction used to separate source and test is on the file extension: `*.spec.js` and `*.mock.js`.

The `karma.conf.js` file delivered with the project is plugged with the same features and configurations than the Gulp scripts. The [File injection](#file-injection) used to populate the `index.html` file is used with the same behaviors to parameter karma.

By default, we chose to use [PhantomJS](http://phantomjs.org/) as test browser, it's shipped inside the NPM install you performed after generating the files so you don't have to have it installed in global. There is an exception when you use Traceur as JS pre-processor as they are incompatible, we switch to Chrome.

Still as default choice, the test framework is [Jasmine](http://jasmine.github.io/). It would be perfect if it was an option to choose another one in the generator but it's not the case at this point.

To allow tests to load HTML partials especially for the directives tests, we use a Karma plugin [karma-ng-html2js-preprocessor](https://github.com/karma-runner/karma-ng-html2js-preprocessor).

Other than that, we try to use as less Karma plugins as possible because they often duplicate process we already have inside Gulp. For sake of coherence and stability we're searching for a process centralized in Gulp and not duplicated in Karma or other tools like perhaps Webpack.

## Optimization process

The central piece of the optimization process is the use of the [gulp-useref](https://github.com/jonkemp/gulp-useref). Its task is to concat files and rewriting the `index.html` file to points on the concat versions of the files. All works with HTML comments block starting with `<!-- build:(...) ->` and ending with `<!-- endbuild -->`.

The plugin allows us to have gulp filters to apply transformations for the different kind of files. So the build task filter the script files then apply the optimizations transformations like [Uglify](https://github.com/mishoo/UglifyJS2) and then use the styles files and do the same for the styles.

The second important plugin used is [gulp-rev](https://github.com/sindresorhus/gulp-rev) which appends the content hash of the generated file names in order to prevent all cache problems when you deliver a new version.

The optimization process is configured (through the comments in `index.html`) to produced two JavaScript files, one for your libraries and another for your sources. It also produces one CSS file (we used to generate two like for the scripts but it created some problems).

All the HTML partials found in the sources are transformed in JavaScript with the plugin [gulp-angular-templatecache](https://github.com/miickel/gulp-angular-templatecache) and put in the sources bundle in a way which should be totally transparent for the Angular app.

All the "other" files which are not processed by any mechanism should be copied in the `dist` folder with the same path by the task `other`.
