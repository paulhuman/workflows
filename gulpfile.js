'use strict';

var gulp   = require('gulp'),
    util   = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true }).on('error', util.log))
        .pipe(gulp.dest('components/scripts'));

});

gulp.task('concat', function () {
    gulp.src(jsSources)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('builds/development/js'));
});
