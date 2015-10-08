# Use spritesheets

## [#154](https://github.com/Swiip/generator-gulp-angular/issues/154)

Yes! CSS3, font icons, svg are great tools! But unfortunately there are some layouts and solutions we need to compress to reduce the number of requests.

There are some approaches to figure out this issue easily.

Using [gulp spritesmith](https://github.com/twolfson/gulp.spritesmith).
Using [compass sprite](http://compass-style.org/help/tutorials/spriting).

We could include both in a option. If the user select to use sass, ask for compass and include the task. if the user select other css preprocessor, we could ask for include spritesmith.

I've been using spritesmith + [imagemin](https://github.com/imagemin/imagemin) + [csso](https://github.com/ben-eb/gulp-csso) in production and works pretty good!

A simple example:
```js
gulp.task('sprite', function () {
    var spritesmith = require('gulp.spritesmith');
    var imagemin = require('gulp-imagemin');
    var csso = require('gulp-csso');
    var del = require('del');
    // Generate our spritesheet
    del(['app/css/*_sprite.png'], function (err) {
        var spriteData = gulp.src('src/images/**/*.png').pipe(spritesmith({
            imgName: new Date().getTime()+'_sprite.png',
            cssName: 'sprite.css'
        }));
        // Pipe image stream through image optimizer and onto disk
        spriteData.img
            .pipe(imagemin())
            .pipe(gulp.dest('app/css/'));

        // Pipe CSS stream through CSS optimizer and onto disk
        spriteData.css
            .pipe(csso())
            .pipe(gulp.dest('src/css/'));
    });
});
```
