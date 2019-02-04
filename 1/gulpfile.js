
// новый файл gulp - по образцу новой версии gulp v4.0
//     // http://localhost:63342/1/dist/index.html
// страницу браузера все равно открываю вручную, т.к. автоматическое обновление страницы в версии 4 пока не удалось настроить - страница сама не обновляется почему-то

let gulp = require("gulp");
let concat = require("gulp-concat"); // files concatenation - not neccessary here  - delete from here and from package.json ??
let uglify = require("gulp-uglify"); // js minification - not neccessary here  - delete??
let sass = require("gulp-sass");
let browserSync = require("browser-sync").create();
let useref = require("gulp-useref"); //html blocks concatenation - not neccessary here - delete??
let gulpIf = require("gulp-if"); // conditionally filter content - not neccessary here - delete??
let imagemin = require("gulp-imagemin");
let cache = require("gulp-cache");
let cleanCss = require("gulp-clean-css"); // css minification
let del = require("del");
let runSequence = require("run-sequence");
let autoprefixer = require("gulp-autoprefixer");
let ejs = require("gulp-ejs");

let paths = {
    styles: {
        app: 'app/sass/**/*.scss',
        dist: 'dist/css/'
    },
    scripts: {
        app: 'app/js/**/*.js',
        dist: 'dist/js/'
    },
    html: {
        app: 'app/views/*.ejs',
        dist: 'dist/'
    }
};



function clean() {
    return  del('dist'); // удаляем лишние промежуточные файлы
}

function styles() {
    return gulp.src(paths.styles.app) // берем файлы *.scss из папки sass
        .pipe(sass().on('error', sass.logError)) // компилируем sass в css и отслеживаем ошибки
        .pipe(autoprefixer({ browsers: ['last 50 versions'], cascade: false }) ) // выставляем необходимые вендорные префиксы для браузеров
        .pipe(cleanCss()) // минификация css
        .pipe(gulp.dest("app/css/"))  // направляе скомпилированные из sass css-файлы в указанную папку
        .pipe(gulp.dest(paths.styles.dist))  // направляе скомпилированные из sass css-файлы в указанную папку
        .pipe(browserSync.stream()); // перезагрузка страницы браузера
}

function html() {
    return gulp.src(paths.html.app)
        .pipe(ejs({msg:"ejs processing"}, {}, {ext:'.html'}))
        .pipe(gulp.dest('app'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
}

function img() {
    return gulp.src("app/img/**/*") // берем файлы из папки img
        .pipe(cache(imagemin() ) ) // минификация файлов
        .pipe(gulp.dest("dist/img")) // направляем файлы в нужную директорию

}

function fonts() {
    return gulp.src("app/fonts/*") // берем файлы шрифтов
        .pipe(gulp.dest("dist/fonts")) // направляем файлы в нужную директорию
}

function cleandist() {
    return del(['dist/**/*', '!dist/css', '!dist/images', '!dist/images/**/*']); // удаляем лишние промежуточные файлы, кроме изображений
}



function watch() {
    gulp.watch('app/sass/**/*.scss', gulp.series(styles));
    gulp.watch(paths.html.app, gulp.series(html));
}

let build = gulp.series(cleandist, fonts, img, styles, html);


function reload(done) {
    browserSync.stream();
    done();
}



gulp.task('build', build);
gulp.task('default', build);
gulp.task('watch', watch, reload(build));