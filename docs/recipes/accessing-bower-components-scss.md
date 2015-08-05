# Accessing 'bower_components' in .scss files without having to path ../../bower_components/

## [#550](https://github.com/Swiip/generator-gulp-angular/issues/550)

```javascript
var sassOptions = {
  loadPath: [ options.src + '/../bower_components/my-styles/'],
  style: 'expanded'
};
```

For those who use Foundation 5:

```javascript
var sassOptions = {
  loadPath: [options.src + '/../bower_components/foundation/scss'],
  style: 'expanded'
};
```

And then you can write this in the index.scss

```javascript
@import 'foundation';
```
