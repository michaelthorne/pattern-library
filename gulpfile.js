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
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var del = require('del');
var ftp = require('vinyl-ftp');
var credentials = require('./credentials.json');
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

gulp.task('clean:dist', function () {
    return del([paths.dist]);
});

/*
 * Copy
 */

gulp.task('assets', function () {
    return gulp.src([
            paths.src + 'img/**/',
            paths.src + 'apple-touch-icon.png',
            paths.src + 'favicon.ico',
            paths.src + 'humans.txt',
            paths.src + 'robots.txt'], {
            'base': paths.src
        })
        .pipe(gulp.dest(paths.build));
});

gulp.task('assets:dist', function () {
    return gulp.src([
            paths.src + 'img/**/',
            paths.src + 'apple-touch-icon.png',
            paths.src + 'favicon.ico',
            paths.src + 'humans.txt',
            paths.src + 'robots.txt'], {
            'base': paths.src
        })
        .pipe(gulp.dest(paths.dist));
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

    return gulp.src([paths.dist + '/**/*'])
        .pipe(conn.dest('/'));
});

/*
 * JavaScript
 */

gulp.task('scripts', function () {
    return gulp.src([
            paths.src + 'js/*',
            paths.src + 'js/**/*'], {
            'base': paths.src
        })
        .pipe(gulp.dest(paths.build));
});

gulp.task('scripts:dist', function () {
    return gulp.src([
            paths.src + 'js/*',
            paths.src + 'js/**/*'], {
            'base': paths.src
        })
        .pipe(gulp.dest(paths.dist));
});

/*
 * Mustache
 */

gulp.src("./templates/*.mustache")
    .pipe(mustache('your_json_file.json', {}, {}))
    .pipe(gulp.dest("./dist"));

/*
 * Process HTML
 */

gulp.task('processhtml', function () {
    return gulp.src(paths.src + '**/*.html')
        .pipe(processHTML({
            process: true,
            data: {
                updated: moment().format('MMM DD, YYYY [•] hh:mm A'),
                version: pkg.version
            }
        }))
        .pipe(gulp.dest(paths.build));
});

gulp.task('processhtml:dist', function () {
    return gulp.src(paths.src + '**/*.html')
        .pipe(processHTML({
            process: true,
            data: {
                updated: moment().format('MMM DD, YYYY [•] hh:mm A'),
                version: pkg.version
            }
        }))
        .pipe(gulp.dest(paths.dist));
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

gulp.task('sass:dist', function () {
    return gulp.src(paths.src + 'sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.dist + '/css'))
        .pipe(reload({stream: true}));
});

/*
 * Watch
 */

gulp.task('watch', function () {
    gulp.watch(paths.src + 'img/**/*', ['assets']);
    gulp.watch(paths.src + '**/*.js', ['scripts']);
    gulp.watch(paths.src + '**/*.scss', ['sass']);
    gulp.watch(paths.src + '**/*.html', ['processhtml']).on('change', reload);
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
 * Default task
 */

gulp.task('default', function () {
    runSequence('build', ['server', 'watch']);
});

/*
 * Build task
 */

gulp.task('build', function () {
    runSequence('clean', ['assets', 'scripts', 'sass', 'processhtml']);
});

/*
 * Distribution task
 */

gulp.task('dist', function () {
    runSequence('clean:dist', ['assets:dist', 'scripts:dist', 'sass:dist', 'processhtml:dist']);
});

/*
 * Deploy task
 */

gulp.task('deploy', function () {
   runSequence('clean:dist', ['assets:dist', 'scripts:dist', 'sass:dist', 'processhtml:dist'], 'ftp');
});

/*
 * Alias for the default task
 * i.e. `npm start`
 */

gulp.task('start', ['default']);
