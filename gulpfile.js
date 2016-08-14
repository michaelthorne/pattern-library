var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('sass', function () {
    return gulp.src('src/sass/style.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('build/css'));
});

gulp.task('watch', function () {
    return gulp.watch('src/sass/**/*.scss', ['sass'])
});

gulp.task('build', ['clean', 'sass']);
gulp.task('default', ['build', 'watch']);
