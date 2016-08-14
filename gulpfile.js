var gulp = require('gulp');
var connect = require('gulp-connect');
var del = require('del');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');

gulp.task('clean:build', function () {
    del(['build']);
});

gulp.task('connect', function () {
    connect.server({
        root: 'build',
        livereload: true,
        port: 1337
    });
});

gulp.task('copy:build', function () {
    return gulp.src(['src/**.html', 'src/apple-touch-icon.png', 'src/favicon.ico', 'src/humans.txt', 'src/robots.txt'])
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('./app/*.html')
        .pipe(connect.reload());
});

gulp.task('sass:build', function () {
    return gulp.src('src/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.scss', ['sass:build']);
    gulp.watch('src/**/*.html', ['copy:build']);
});

gulp.task('build', function () {
    runSequence('clean:build', ['copy:build', 'sass:build']);
});

gulp.task('default', function () {
    runSequence('build', ['connect', 'watch']);
});
