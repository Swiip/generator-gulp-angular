# How to add fontawesome?

## [#337](https://github.com/Swiip/generator-gulp-angular/issues/337)

First, you need install fontawesome through bower
```bash
bower install fontawesome
```

Next, you need add to your scss file this lines (please, check the paths if you
change location of generator main.scss file):

```scss
$fa-font-path: "../../bower_components/font-awesome/fonts";
@import "../../bower_components/font-awesome/scss/font-awesome.scss";
```

Finally, you need add this pipeline in `gulp/build.js`, in `html` task:

```js
.pipe($.replace('../../bower_components/font-awesome/fonts', '../fonts'))
```
