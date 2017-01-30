/*
 * Variables
 */

var paths = {
    src: 'src/',
    build: 'build/'
};

/*
 * Plugins
 */

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var del = require('del');
var ftp = require('vinyl-ftp');
var credentials = require('./credentials.json');
var merge = require('gulp-merge-json');
var moment = require('moment');
var mustache = require('gulp-mustache');
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
    return gulp.src(paths.src + '**/*.{ico,js,png,txt}', {
        'base': paths.src
    }).pipe(gulp.dest(paths.build));
});

/*
 * FTP
 */

gulp.task('ftp', function () {
    var conn = ftp.create({
        host: credentials.host,
        user: credentials.usename,
        password: credentials.password,
        parallel: 10
    });

    return gulp.src([paths.build + '/**/*']).pipe(conn.dest('/'));
});

/*
 * Merge JSON
 */

gulp.task('merge_json', function () {
    return gulp.src(paths.src + 'data/**/*.json')
        .pipe(merge('data.json'))
        .pipe(gulp.dest(paths.build + 'data'));
});

/*
 * Mustache
 */

gulp.task('mustache', function () {
    return gulp.src(paths.src + '**/*.mustache')
        .pipe(mustache(paths.build + 'data/data.json', {
            extension: '.html'
        }))
        .pipe(gulp.dest(paths.build));
});

/*
 * Process HTML
 */

gulp.task('processhtml', function () {
    return gulp.src(paths.build + '**/*.html')
        .pipe(processHTML({
            process: true,
            data: {
                updated: moment().format('MMM DD, YYYY [•] hh:mm A'),
                version: pkg.version
            }
        }))
        .pipe(gulp.dest(paths.build));
});

/*
 * Sass
 */

gulp.task('sass', function () {
    return gulp.src(paths.src + 'sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.build + '/css'))
        .pipe(reload({stream: true}));
});

/*
 * Watch
 */

gulp.task('watch', function () {
    gulp.watch(paths.src + '**/*.{ico,js,png,txt}', ['assets']);
    gulp.watch(paths.src + '**/*.scss', ['sass']);
    gulp.watch(paths.src + '**/*.json', function () {
        runSequence('merge_json', 'mustache', 'processhtml')
    }).on('change', reload);
    gulp.watch(paths.src + '**/*.mustache', function () {
        runSequence('mustache', 'processhtml')
    }).on('change', reload);
});

/*
 * Starts up a static server at http://localhost:1337 from the `build` folder
 */

gulp.task('server', function () {
    browserSync.init({
        port: 1337,
        reloadDelay: 500,
        server: paths.build,
        startPath: '/pattern-library'
    });
});

/*
 * Build
 */

gulp.task('build', function () {
    runSequence('clean', 'merge_json', 'assets', 'sass', 'mustache', 'processhtml');
});

/*
 * Default
 */

gulp.task('default', function () {
    runSequence('build', 'server', 'watch');
});

/*
 * Deploy
 */

gulp.task('deploy', function () {
    runSequence('build', 'ftp');
});

/*
 * Alias for the default task
 * i.e. `npm start`
 */

gulp.task('start', 'build');
