# How it Works

This document aims to explain all mechanisms included in the project generated from this generator.

When you have a problem or want to understand why it's working, check this file before asking to understand why should have been happening.

## `gulpfile.js`

As the gulpfile was becoming enormous, we decided to split it up into several files inside the `gulp` directory. Now, the gulpfile does nothing more than loading all `.js` or `.coffee` files inside the `gulp` directory.

It still define one task which is the default one which will be launch is you pass no arguments to the gulp command. It will be the `clean` task followed by the `build`.

## `gulp/conf.js`

The conf module doesn't define any gulp tasks. It's there to define some global values used across multiple gulp files.

We don't abuse of global configurations as a respect of the Gulp main principal **Code over configuration** (and also because we're still a bit traumatized by Grunt) but still there is the need of some global values such as:

- **paths**: main paths of the project such as `src` and `.tmp`.
- **wiredep**: wiredep is used in several tasks and needs to be configured the same way in all tasks.
- **errorHandler**: the main weakness of Gulp 3 is the error handler, we keep a centralized error handler implementation here.

## `gulp/scripts.js`

The `scripts` task is launched at build, dev and test time and in the watch at each change on a script file. It's this task which will trigger a Browser Sync reload when needed.

### With no JS preprocessor

When you don't have JS preprocessor, the `scripts` task goal is to pass the linter (currently JSHint) on your code.

### With Coffee

This task will launch the CoffeeLint analyze and the Coffee compilation and put result files in the `.tmp/serve` folder.

### With TypeScript

The `scripts` task has a dependency which is the installation of typings with the `tsd:install` gulp task. Once the typings ready, TSLint, TypeScript compilation and finally a concatenation of all JavaScript files produced in the right order are done.

### With ES6

The `scripts` task changes a bit for ES6 to handle CommonJS modularization used by the ES6 preprocessors. The standard gulp stream is replaced by Webpack through its gulp plugin. It's Webpack which become responsible for compilation, sourcemap and linting.

As Webpack as a good watch feature, 2 tasks are produced: `scripts` and `scripts:watch`. In the second we delegates to Webpack the watching of the source script files.
