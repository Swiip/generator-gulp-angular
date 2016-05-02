# How to add fontawesome?

## [#337](https://github.com/Swiip/generator-gulp-angular/issues/337)

First, you need install Font Awesome through bower:

```bash
bower install font-awesome
```

Next, you need add to your scss file this lines (please, check the paths if you
change location of generator main.scss file):

```scss
$fa-font-path: "../../bower_components/font-awesome/fonts";
@import "../../bower_components/font-awesome/scss/font-awesome.scss";
```

Then you need to override Font Awesome's `main` property so that the fonts are
included in builds. Edit your local `bower.json` to include:

```bower
"overrides": {
  "font-awesome": {
    "main": [
      "scss/font-awesome.scss",
      "fonts/*"
    ]
  }
}
```

Finally, you need add this pipeline in `gulp/build.js`, in `html` task:

```js
.pipe($.replace('../../bower_components/font-awesome/fonts', '../fonts'))
```
