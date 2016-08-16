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

gulp.task('clean:build', function () {
    return del(['build']);
});

/*
 * Copy
 */

gulp.task('copy:build', function () {
    return gulp.src([
            'src/apple-touch-icon.png',
            'src/favicon.ico',
            'src/humans.txt',
            'src/robots.txt'])
        .pipe(gulp.dest('build'));
});

/*
 * Process HTML
 */

gulp.task('processhtml:build', function () {
    return gulp.src('src/**/*.html')
        .pipe(processHTML({
            process: true,
            data: {
                updated: moment().format('YYYY/MM/DD hh:mm A'),
                version: pkg.version
            }
        }))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
});

/*
 * Sass
 */

gulp.task('sass:build', function () {
    return gulp.src('src/sass/style.scss')
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
        server: 'build'
    });

    gulp.watch('src/sass/**/*.scss', ['sass:build']);
    gulp.watch('src/**/*.html', ['processhtml:build']).on('change', reload);
});

/*
 * The default task
 * Note: `copy:build`, `sass:build`, `processhtml:build` run in parallel as they have no dependencies with each other.
 */

gulp.task('default', function () {
    runSequence('clean:build', ['copy:build', 'sass:build', 'processhtml:build'], 'serve');
});

/*
 * Alias for the default task
 * e.g. `npm start`
 */

gulp.task('start', ['default']);
