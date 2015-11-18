# How to add fontawesome?

## [#337](https://github.com/Swiip/generator-gulp-angular/issues/337)
Awesome. It's all working now. The scss import looks like

```scss
$fa-font-path: "../../bower_components/fontawesome/fonts";
@import "../../bower_components/fontawesome/scss/font-awesome.scss";
```

Add a step to the `html` pipeline in `gulp/build.js`:

```js
.pipe($.replace('../../bower_components/fontawesome/fonts', '../fonts'))
```
