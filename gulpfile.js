/// <binding BeforeBuild='clean, less' AfterBuild='min:css, min:js' />
'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    del = require('del');

gulp.task('less', function () {
    return gulp.src(['styles/less/index.less', 'styles/less/module/*.less'])
        .pipe(plumber())
        .pipe(less())
        .pipe(concat('styles/css/site.css'))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('min:js', function () {
    return gulp.src(['styles/js/services/*.js', 'styles/js/app/*.js', 'wwwroot/js/route/*.js', 'wwwroot/js/controllers/*.js'])
        .pipe(concat('styles/js/bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/app.bundle.js'));
});

gulp.task('clean', function () {
    return del(['styles/css/site.min.css', 'styles/js/bundle.js']);
});

gulp.task('clean:js', function () {
    return del('styles/js/bundle.js');
});

gulp.task('clean:css', function () {
    return del('styles/css/site.min.css');
});

gulp.task('default', gulp.series('clean', 'less', 'min:js'));

gulp.task('default:js', gulp.series('clean:js', 'min:js'));

gulp.task('default:css', gulp.series('clean:css', 'less'));

gulp.task('watch:js', function () {
    return gulp.watch('styles/js/*.js', gulp.series('default:js'));
});

gulp.task('watch:css', function () {
    return gulp.watch('styles/less/**/*.less', gulp.series('default:css'));
});