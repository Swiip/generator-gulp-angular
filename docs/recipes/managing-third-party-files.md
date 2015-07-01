# Where to place third-party files?

## [#413](https://github.com/Swiip/generator-gulp-angular/issues/413)

In `index.html` there are 2 types of auto-injected files during `gulp build` and `gulp serve`:
* CSS part
* JS part

#### CSS
They are inserted at end of `head` by 2 blocks that write 2 files containing all the CSS.
* `<!-- build:css({.tmp/serve,src}) styles/vendor.css -->`: Any bower's vendor stylesheets present in `bower.json` under property `dependencies` (:warning: not devDependencies) **AND** located in `/bower_components/`

* `<!-- build:css({.tmp/serve,src}) styles/app.css -->`: Yours stylesheets who match with any files located into `/src/{app,components}/**/*.{css,scss,less,styl}`


#### JS
They are inserted at end of `body` by 2 blocks that write 2 files containing all the JS.
* `<!-- build:js(src) scripts/vendor.js -->`: Any bower's vendor scripts present in `bower.json` under property `dependencies` (:warning: not devDependencies) **AND** located in `/bower_components/`

* `<!-- build:js({.tmp/serve,.tmp/partials,src}) scripts/app.js -->`: Yours scripts who match with any files located into `/src/{app,components}/**/*.{js,es6,ts,coffee}`


#### Where to place the third-party files (scripts and stylesheets) who are not installed with bower ?
* *Without* auto-inject feature: you can use any folders except `/src/app/` and `/src/components/`
* *With* auto-inject feature: you should use `/src/app/` and `/src/components/`
* **With** auto-inject feature **in custom folder**: you should complete gulp's tasks

##### Notes:
* the parsing of javascript files is managed in `/gulp/script.js`
* the parsing of css files is managed in `/gulp/styles.js`
* the injection in `index.html` is managed in `/gulp/inject.js`
