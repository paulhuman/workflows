'use strict';

var gulp       = require('gulp'),
    util       = require('gulp-util'),
    coffee     = require('gulp-coffee'),
    concat     = require('gulp-concat'),
    compass    = require('gulp-compass'),
    browserify = require('gulp-browserify');

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];

gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true }).on('error', util.log))
        .pipe(gulp.dest('components/scripts'));

});

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('scripts.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'));
});

gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            css: 'components/sass',
            image: 'builds/development/images',
            comments: true,
            style: 'expanded'
        }))
        .on('error', util.log)
        .pipe(gulp.dest('builds/development/css'));
});

gulp.task('default', ['coffee', 'js', 'compass']);
