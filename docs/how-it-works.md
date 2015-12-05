# How it Works

This document aims to explain all mechanisms included in the project generated from this generator.

When you have a problem or want to understand why it's working, check this file to try to understand what's happening.

## `gulpfile.js`

As the gulpfile was becoming enormous, we decided to split it up into several files inside the `gulp` directory. Now, the gulpfile does nothing more than loading all `.js` or `.coffee` files inside the `gulp` directory.

It only defines one task which is the default one which will be launched if you pass no arguments to the gulp command. It will be the `clean` task followed by the `build`.

## `gulp/conf.js`

The conf module doesn't define any gulp tasks. It's there to define some global values used across multiple gulp files.

We don't abuse of global configurations as a respect of the Gulp main principal **Code over configuration** (and also because we're still a bit traumatized by Grunt) but still there is the need of some global values such as:

- **paths**: main paths of the project such as `src` and `.tmp`.
- **wiredep**: wiredep is used in several tasks and needs to be configured the same way in all tasks.
- **errorHandler**: the main weakness of Gulp 3 is the error handler, we keep a centralized error handler implementation here.


## `gulp/inject.js`

The `inject` task is intended to centralized all modifications on the `index.html` of your project in the development phase. As we propose today a complete system of injection of all your files, there is several steps to organize.

As we never want to modify a source file, the injected `index.html` is targeted inside the temporary folder. You could look there to check if the changes are ok.

The task is organized by preparing first all settings of the injections the making the changes in one Gulp stream at the end.

The 3 steps of injections are:

- **Inject styles**: use of [gulp-inject](https://github.com/klei/gulp-inject) to list all the CSS files inside the head of the page.
- **Inject scripts**: use of [gulp-inject](https://github.com/klei/gulp-inject) to list all the JS files inside the body of the page (below the app).
- **Wiredep**: use of [wiredep](https://github.com/taptapship/wiredep) streams to add CSS and JS files of the Bower dependencies.

### Listing and ordering files for injection

For the first 2 tasks of injection. When you use plain JS, the list is made by listing the `src` folder. When there are pre-processing, the transformations are launched before (the `inject` task depends on `scripts` and `styles`) and the injection are performed after by listing the `tmp/serve` folder.

As the script files has to be sorted in order to work. We use a magic script which analyze the content of files and order them following the Angular modules declaration. It's used at the end of the inject stream just before writing. Warning, this plugin requires to have the content of the files and fail if you use the `{read: false}` option from `gulp.src`.

### Locating places in the `index.html`

[gulp-inject](https://github.com/klei/gulp-inject) put the `<script>` and `<link>` tags insides comments starting by `<!-- inject:css -->` or `<!-- inject:js -->` and ending by `<!-- endinject -->`.

[wiredep](https://github.com/taptapship/wiredep) put the `<script>` and `<link>` tags insides comments starting by `<!-- bower:css -->` or `<!-- bower:js -->` and ending by `<!-- endbower -->`.

Don't put anything inside this comments in your sources because the `inject` task will override it without warning you.


## `gulp/scripts.js`

The `scripts` task is launched at build, dev and test time and at the watch of any change on a script file. It's this task which will trigger a Browser Sync reload when needed.

### With no JS preprocessor

When you don't have JS preprocessor, the `scripts` task goal is to pass the linter (ESLint) on your code.

### With Coffee

This task will launch the CoffeeLint analyze and the Coffee compilation and put result files in the `.tmp/serve` folder.

### With TypeScript

The `scripts` task has a dependency which is the installation of typings with the `tsd:install` gulp task. Once the typings ready, TSLint, TypeScript compilation and finally a concatenation of all JavaScript files produced in the right order are done.

`tsd:install` is located in the `gulp/tsd.js` which is created only when choosing TypeScript. It will automatically download typings files for the dependency found in Bower with a popular library [TSD](http://definitelytyped.org/tsd/)

### With ES6

The `scripts` task changes a bit for ES6 to handle CommonJS modularization used by the ES6 preprocessors. The standard gulp stream is replaced by Webpack through its stream feature. It's Webpack which become responsible for compilation, sourcemap and linting.

As Webpack as a good watch feature, 2 tasks are produced: `scripts` and `scripts:watch`. In the second we delegates to Webpack the watching of the source script files.


## `gulp/styles.js`

The `styles` task is launched at build, dev and test time and at the watch of any change on a style file. It's this task which will trigger a Browser Sync reload when needed.

This file exists only if you choose a style pre-processor.

### Injection

As all styles pre-processors handle themselves the inclusions of all dependency files, as an exception, the style task is part of the injection process.

Like in the [`gulp/inject.js`](#gulpinjectjs), there is two kinds of injection, first, your files and the one from Bower dependencies. Still like in the standard injection, it's controlled by comments but this time in the format of the pre-processor: `// bower:(scss|less|styl)` -> `// endbower` & `// injector` -> `// endinjector`.

The injection is on step of the main Gulp stream for the styles. Once processed, the uniq file inside `.tmp/serve` will follow the standard injection process to be included in the `index.html`.

### Style stream

All transformations are made in a single stream. As it includes injection and pre-processing, it could be disturbing because there is no work files but this is the magic and power of Gulp! If you intend to debug or understanding the process, the better way is to comment one or several transformations of the stream to look at single step.

The stream by itself is composed of some very identifiable steps:
- Injection with [gulp-inject](https://github.com/klei/gulp-inject)
- Injection with [Wiredep](https://github.com/taptapship/wiredep)
- Start of sourcemap
- Style pre-processing with one of the one supported: Sass, Less or Stylus
- Autoprefixer with [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)
- End of sourcemap
- Writing files in `.tmp/serve`
- Reloading files in Browser Sync if present

### Ruby Sass

Ruby Sass (the original implementation) caused us some pains fitting in the process. The Gulp plugin is a bit "touchy" (it's not supporting Gulp sourcemap system for example) and the options are not the same as for [node-sass](https://www.npmjs.com/package/node-sass).

In order to have the sourcemaps working, there is some exceptions. The main trick is to ask Ruby Sass to generate its own sourcemaps and then, load them with Gulp with `$.sourcemaps.init({ loadMaps: true })` and continue the normal process.


## `gulp/markups.js`

The generator handles template pre-processing even if there is no "examples" in the created project (only because it's a lot of work to maintain all versions).

When a HTML pre-processor is chosen, the `markups` task is inserted and works the same as `styles` and `scripts` one.

The transformation is handled by [Consolidate](https://github.com/tj/consolidate.js) the reference library which also handle template processing inside [Express](http://expressjs.com/).

## `gulp/watch.js`

You can use the `watch` task directly if you just want the pre-processing of your files to be triggered automatically but it's mainly used through Browser Sync with the `server` task.

The `watch` task is responsible for watching all the files of the project in order to relaunch all the processings needed.

### Standard Gulp watch

We intentionally kept using the official Gulp watch even if we know that it has some weakness (first file of a directory not seen for example). But we know that there is some external lib which can go further. We just want to keep things simple and hope to have the Gulp 4 release which will fix that.

### Watch with function

The most common use of the watch API is to list files and just indicate which tasks to launch on a change. To gain some performance we go further by using the function version which ables us to have a function called on every change. As we have an `event` object which describe the change, we can be more specific.

The use case is the need of the injection. Many changes will only be a change on an existing files. This needs to trigger the pre-processing but not the injection. On the oposite, when it's a file creation, we need to relaunch the injection which will trigger the pre-processing by dependency.

### What is watched

As you can imagine, there is one watch expression for each type of files which trigger the related task.

Two remarks could be made:
- Root HTML files and the `bower.json` are watched to trigger the injection in order to react on modification in the `index.html` or an modification of the list of the dependencies.
- All HTML modification trigger a Browser Sync, indeed, as Gulp is responsible to trigger Browser Sync reload, a template modification needs to trigger a reload even when there is no other processing to launch.


## `gulp/server.js`

The generator ship a fully featured development server through the use of [Browser Sync](http://www.browsersync.io/). Don't hesitate to look at its website to know more about all its features and options.

The `serve` task has as only goal to configure and launch it.

### Browser Sync configuration

The base directories for Browser Sync are `.tmp/serve` and `src` with a priority for `.tmp/serve`. The processed version of a file has to be chosen over the source one.

As the `bower_components` folder is not located in any of the base paths, a special routes is added for this folder to be addressed by `/bower_components`.

The default Browser Sync port is `3000`, if you ever need to change it, head over to the [gulp/server.js](https://github.com/Swiip/generator-gulp-angular/blob/master/generators/app/templates/gulp/_server.js#L42) file and add the `port` attribute to the *server* variable.
Example below :
```javascript
browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser,
    port: 4000 // Add this line to change the default port
  });
```

Last configuration, the `browser` option is used to open the default browser to the root page.

Head over to [Browser Sync list of options](http://www.browsersync.io/docs/options/) for the full list of available configurations for BrowserSync.

### Proxy

Browser Sync is powered by an express server. The API allows us to inject any Express middleware. Behind comments, an example of use of [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) is prepared.

The middleware allows very simply to add a proxy which takes all requests to a specific context a redirect it to another server.

It allows to work very simply with a backend server without dealing with CORS configurations.


## `gulp/unit-test.js`

The `test` task is targeted to launch a fully configured Karma / Jasmine / PhantomJS configuration.

### Limits between Gulp / Karma

Inside the Gulp file, there is not much as the most part of the Karma configuration stays in the `karma.conf.js`. The Gulp file mainly launch Karma through its Node API (`gulp-karma` is deprecated in profit of the Node API).

Our objective are to allow user to use Karma without Gulp if needed. Most of the times to be plugged inside an IDE.

As we wanted to keep some useful tools from the generator. It's from the Karma configuration file that some tools or configuration of the generator which are called.

### `karma.conf.js`

The `listFiles` function at the start of the file use [wiredep](https://github.com/taptapship/wiredep) and the `gulp/conf.js` file to list the files of the project the same way the injection does. This way, the user should never has to change the file list in the Karma configuration.

Past that two Karma plugin are used:
- [angularFilesort](https://www.npmjs.com/package/karma-angular-filesort): to order script files like in the injection.
- [ngHtml2JsPreprocessor](https://github.com/karma-runner/karma-ng-html2js-preprocessor): to be able to load templates inside tests which is needed in directive tests especially.


## `gulp/e2e-tests.js`

The `protractor` task is build on top of the [gulp-protractor](https://github.com/mllrsohn/gulp-protractor) plugin which handles the downloading and the launching of an embedded Webdriver with Protractor.

With a dependency on the task `serve:e2e` which launch the server without opening a browser on it, the server is started and a dependency on the initialization of Webdriver, the protractor tests can be launched.

The `protractor.conf.js` are mainly default configurations.

## `gulp/build.js`

Inside this files, there is several Gulp tasks to organize the whole optimization process of the application.

The main goal is to create a `dist` folder fully portable which behave exactly like the source version.

### Main process

The main process is located in the `html` task. It contains the re-writing of the `index.html`, the concatenation and minifying of all files in one single Gulp stream.

As all files will be in the same stream, we use Gulp filters to filter a type of files to perform some transformation and remove the filter with the `restore()` method.

### Partials

One of the optimization is to mount all the partials or templates inside the script bundle in order to reduce the number of request at the loading. We do that in the `partials` task which use the [gulp-angularTemplatecache](https://www.npmjs.com/package/gulp-angular-templatecache) plugin in order to transform the HTML files in valid JavaScript Angular desclaration.

The Gulp stream load the HTML files from the sources, minify the code HTML, apply the AngularTemplateCache transformation and put them in a `.tmp/partials` to be injected in the main process with the same [gulp-inject](https://github.com/klei/gulp-inject) plugin already used.

### Useref

[gulp-useref](https://github.com/jonkemp/gulp-useref) is the backbone of the optimization process. Starting by the `index.html` it loads all the files using the `<!-- build:....` -> `<!-- endbuild -->` comments.

It adds all the files in the Gulp stream which ables us to filter them and apply transformations (line `.pipe(assets = $.useref.assets())`).

It also perform the concatenation and rewrite the `index.html` pointing on the new file (line `.pipe($.useref())`).

To understand where the files are located and how to call the targeted files, you have to look at the comments (not the Gulp file), basically, the syntax is: `<!-- build:{{type: css or js}}({{base path}}) {{target file path}} -->`.

More information on [gulp-useref](https://github.com/jonkemp/gulp-useref).

### Rev

Another great feature of the generator is to rename your optimized files with the hashcode of the content. It prevent all problems of client caches which prevent them to reload new version of the files. With the content hashcode, only the files which has changed will change names.

This feature is possible thanks to the [gulp-rev](https://github.com/sindresorhus/gulp-rev) which is used inside the main process. A second step [gulp-revReplace](https://github.com/jamesknelson/gulp-rev-replace) is needed for the files to be renamed inside the new `index.html` created by Useref.

### Images

Proposed as an advanced option, there is a task named `images` which can use [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin) to optimize your images before putting them in the `dist` folder.

It has been removed by default and put behind an advanced option because the NPM dependency is heavy and the image optimization slow so finally lots of people didn't want it anymore.

### Fonts

Some Bower dependencies embed font files. To handle this particular case, there is `fonts` task which copies font files located by wiredep. This task only copy the in the `dist/font` directory.

As we can't keep the original relative path of the font with the CSS file which include it, there is the need of replacing the link. It's why you find with some options the use of [gulp-replace](https://github.com/lazd/gulp-replace) inside the main process. But this solution is **not generic** and could need to be duplicate with the use of others dependencies than default ones.

### Other

We don't know what files you'll have in the `src` folder. We only knows about some types we have specific rules to handle them.

The task `other` simply locate all the files which are not already processed in the `src` folder and copy at them at the same location in the `dist` folder in order to keep the same paths.
