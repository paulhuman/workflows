'use strict';

var gulp       = require('gulp'),
    util       = require('gulp-util'),
    coffee     = require('gulp-coffee'),
    concat     = require('gulp-concat'),
    compass    = require('gulp-compass'),
    connect    = require('gulp-connect'),
    gulpif     = require('gulp-if'),
    uglify     = require('gulp-uglify'),
    htmlmin    = require('gulp-htmlmin'),
    jsonminify = require('gulp-jsonminify'),
    imagemin   = require('gulp-imagemin'),
    browserify = require('gulp-browserify');

var env,
    htmlSources,
    jsonSources,
    sassSources,
    coffeeSources,
    jsSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';
console.log(env + ' build');

if (env === 'development') {
    outputDir = 'builds/development';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production';
    sassStyle = 'compressed';
}

htmlSources = ['builds/development/*.html'];
jsonSources = ['builds/development/js/*.json'];
sassSources = ['components/sass/style.scss'];
coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

gulp.task('html', function () {
    gulp.src(htmlSources)
        .pipe(gulpif(env === 'production', htmlmin({
            collapseWhitespace: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            processScripts: ['text/template']
        })))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload());
});

gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + '/js')))
        .pipe(connect.reload());
});

gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true }))
        .on('error', util.log)
        .pipe(gulp.dest('components/scripts'));

});

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('scripts.js'))
        .pipe(browserify())
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(connect.reload());
});

gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            css: 'components/sass',
            image: outputDir + '/images',
            comments: true,
            style: sassStyle
        }))
        .on('error', util.log)
        .pipe(gulp.dest(outputDir + '/css'))
        .pipe(connect.reload());
});

gulp.task('images', function () {
    gulp.src('builds/development/images/**/*.*')
        .pipe(gulpif(env === 'production', imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }]
        })))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + '/images')))
});

gulp.task('watch', function () {
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/images/**/*.*', ['images']);
});

gulp.task('connect', function () {
    connect.server({
        root: outputDir,
        port: 3000,
        livereload: true
    });
});

// Task js зависит от coffee, но в данном случае исполняется параллельно,
// а необходимо последовательно. В текущем варианте task js
// исполнится дважды (сперва без созданного tagline.js)
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'images', 'connect', 'watch']);
