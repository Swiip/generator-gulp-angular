# Gulp Tasks

Because the `gulpfile.js` was becoming enormous and because I hate huge files, this
directory contains all the gulp tasks splited by purposes. `gulpfiles.js` passes path
configuration to gulp tasks through `gulp.paths`.

## build.js

Contains the build tasks aiming to optimize all your project and create the dist folder
- **partials**: compile html partials in one javascript `templateCacheHtml.js`
- **html**: the big one with `useref`, `rev` and `uglify`.
- **images**: optimize images with imagemin.
- **fonts**: copy fonts from bower to dist
- **misc**: copy other files
- **clean**: delete temporary files
- **build**: html + images + fonts + misc

## e2e-tests.js

Task for launching e2e tests from Gulp. Which means launching local server,
an instance of Selenium and Protractor.

## inject.js

Inject task which link project files in the `index.html` and write the result in `.tmp/serve/index.html`
- Project CSS files
- Project JS files
- Bower css and js deps

**Warning** The `src/index.html` is not modified (it was the case in previous version and is still the case in other generators) but the injected `index.html` is placed in `.tmp/serve`.

## markups.js

Compile your markups files (when you use a HTML preprocessor).

## scripts.js

Compile your scripts with your JS preprocessor if you have one. Run the linter. If you use ES6, will also use Browserify to bundle the files.

## server.js

Gulp tasks which start a server for development or e2e tests.

## styles.js

Compile your styles with your CSS preprocessor. Use injection in the index.*

## unit-tests.js

Task for launching the unit tests with Karma from Gulp.

## watch.js

Watch task which watch over source files to trigger recompilation.
