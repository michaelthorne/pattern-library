/*
 * Variables
 */

var paths = {
    src: 'src/',
    build: 'build/',
    dist: 'dist/'
};

/*
 * Plugins
 */

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');
var moment = require('moment');
var pkg = require('./package.json');
var processHTML = require('gulp-processhtml');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');

/*
 * Clean
 */

gulp.task('clean', function () {
    return del([paths.build]);
});

/*
 * Copy
 */

gulp.task('assets', function () {
    return gulp.src([
            paths.src + 'apple-touch-icon.png',
            paths.src + 'favicon.ico',
            paths.src + 'humans.txt',
            paths.src + 'robots.txt']
        )
        .pipe(gulp.dest(paths.build));
});

/*
 * JavaScript
 */

gulp.task('scripts', function () {
    return gulp.src([
            paths.src + 'js/*',
            paths.src + 'js/*/*'], {
            'base': 'src'
        })
        .pipe(gulp.dest(paths.build))
        .pipe(browserSync.stream());
});

/*
 * Process HTML
 */

gulp.task('processhtml', function () {
    return gulp.src(paths.src + '**/*.html')
        .pipe(processHTML({
            process: true,
            data: {
                updated: moment().format('MMM DD, YYYY [at] hh:mm A'),
                version: pkg.version
            }
        }))
        .pipe(gulp.dest(paths.build))
        .pipe(browserSync.stream());
});

/*
 * Sass
 */

gulp.task('sass', function () {
    return gulp.src(paths.src + 'sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.build + '/css'))
        .pipe(browserSync.stream());
});

/*
 * Starts up a static server at http://localhost:1337 from the `build` folder
 */

gulp.task('serve', function () {
    browserSync.init({
        port: 1337,
        reloadDelay: 1000,
        server: paths.build,
        startPath: '/pattern-library'
    });

    gulp.watch(paths.src + '**/*.js', ['scripts']);
    gulp.watch(paths.src + '**/*.scss', ['sass']);
    gulp.watch(paths.src + '**/*.html', ['processhtml']);
});

/*
 * Default task
 */

gulp.task('default', function () {
    runSequence('build', ['serve']);
});

/*
 * Build task
 */

gulp.task('build', function () {
    runSequence('clean', ['assets', 'scripts', 'sass', 'processhtml']);
});

/*
 * Alias for the default task
 * i.e. `npm start`
 */

gulp.task('start', ['default']);
