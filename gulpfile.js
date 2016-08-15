var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');
var pkg = require('./package.json');
var processHTML = require('gulp-processhtml');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var sass = require('gulp-sass');

gulp.task('clean:build', function () {
    del(['build']);
});

gulp.task('copy:build', function () {
    return gulp.src([
            'src/apple-touch-icon.png',
            'src/favicon.ico',
            'src/humans.txt',
            'src/robots.txt'])
        .pipe(gulp.dest('build'));
});

gulp.task('processhtml:build', function () {
    return gulp.src('src/**/*.html')
        .pipe(processHTML({
            process: true,
            data: {
                version: pkg.version
            }
        }))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
});

gulp.task('sass:build', function () {
    return gulp.src('src/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
});

gulp.task('serve', function () {
    browserSync.init({
        reloadDelay: 1000,
        server: 'build'
    });

    gulp.watch('src/sass/**/*.scss', ['sass:build']);
    gulp.watch('src/**/*.html', ['processhtml:build']).on('change', reload);
});


gulp.task('default', function () {
    runSequence('clean:build', ['copy:build', 'sass:build', 'processhtml:build'], 'serve');
});

gulp.task('start', ['default']);
