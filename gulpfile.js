/*
 * Plugins
 */

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');
var moment = require('moment');
var pkg = require('./package.json');
var processHTML = require('gulp-processhtml');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var sass = require('gulp-sass');

/*
 * Clean
 */

gulp.task('clean', function () {
    return del(['build']);
});

/*
 * Copy
 */

// Miscellaneous static files
gulp.task('copy:misc', function () {
    return gulp.src([
        'src/apple-touch-icon.png',
        'src/favicon.ico',
        'src/humans.txt',
        'src/robots.txt'])
        .pipe(gulp.dest('build'));
});

// Vendor JavaScript
gulp.task('copy:js:vendor', function () {
    return gulp.src([
        'src/js/vendor/jquery.js',
        'src/js/vendor/webfontloader.js'])
        .pipe(gulp.dest('build/js/vendor'))
        .pipe(browserSync.stream());
});

// Custom JavaScript
gulp.task('copy:js:custom', function () {
    return gulp.src([
        'src/js/main.js',
        'src/js/plugins.js'])
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream());
});

/*
 * Process HTML
 */

gulp.task('processhtml', function () {
    return gulp.src('src/**/*.html')
        .pipe(processHTML({
            process: true,
            data: {
                updated: moment().format('MMM DD, YYYY [at] hh:mm A'),
                version: pkg.version
            }
        }))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
});

/*
 * Sass
 */

gulp.task('sass', function () {
    return gulp.src('src/sass/**.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
});

/*
 * Starts up a static server on localhost:1337 from the `build` folder
 */

gulp.task('serve', function () {
    browserSync.init({
        port: 1337,
        reloadDelay: 1000,
        server: 'build',
        startPath: '/pattern-library'
    });

    gulp.watch('src/js/vendor/*.js', ['copy:js:vendor']);
    gulp.watch('src/js/*.js', ['copy:js:custom']);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/**/*.html', ['processhtml']).on('change', reload);
});

/*
 * The default task
 */

gulp.task('default', function () {
    runSequence('clean', ['copy:misc', 'copy:js:custom', 'copy:js:vendor', 'sass', 'processhtml'], 'serve');
});

/*
 * Alias for the default task
 * i.e. `npm start`
 */

gulp.task('start', ['default']);
