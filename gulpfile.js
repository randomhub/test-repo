'use strict';

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-clean-css'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uncss = require('gulp-uncss'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    watch = require('gulp-watch');



var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        sass: 'src/sass/main.scss',
        img: 'src/img/**/*.*' //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов

    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        sass: 'src/sass/**/*.scss'
    },
    clean: './build'
};

gulp.task('html-build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)); //Выплюнем их в папку build
});

gulp.task('js-build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)); //Выплюнем готовый файл в build
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('css-build', function () {
    gulp.src(path.src.sass) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)); //И в build
});

gulp.task('image-build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)); //И бросим в build
});

gulp.task('build', [
    'html-build',
    'js-build',
    'css-build',
    'image-build'
]);

gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./src/img/sprite/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
            }));

    spriteData.img.pipe(gulp.dest('./build/img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('./build/css/')); // путь, куда сохраняем стили
});

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html-build');
    });
    watch([path.watch.sass], function(event, cb) {
        gulp.start('css-build');
    });
    /*watch([path.watch.js], function(event, cb) {
        gulp.start('js-build');
    });*/
    /*watch([path.watch.img], function(event, cb) {
        gulp.start('image-build');
    });*/
});