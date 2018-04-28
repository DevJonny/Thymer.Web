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
    babel = require('gulp-babel'),
    copy = require('gulp-copy'),
    del = require('del');

gulp.task('less', function () {
    return gulp.src(['src/styles/less/index.less', 'src/styles/less/module/*.less'])
        .pipe(plumber())
        .pipe(less())
        .pipe(concat('site.css'))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('concat:js', function() {
    return gulp.src(['src/js/model/*.js', 'src/js/services/*.js', 'src/js/app/*.js', 'src/js/route/*.js', 'src/js/controllers/*.js'])
        .pipe(babel())
        .pipe(concat('dist/js/bundle.js'))
        .pipe(gulp.dest('.'));
})

gulp.task('min:js', function () {
    return gulp.src(['dist/js/bundle.js'])
        .pipe(rename({suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function () {
    return del(['styles/css/site.min.css', 'dist/css/site.min.css', 'src/js/bundle.js']);
});

gulp.task('clean:js', function () {
    return del('dist/js/bundle.js');
});

gulp.task('clean:css', function () {
    return del(['styles/css/site.min.css', 'dist/css/site.min.css']);
});

gulp.task('default:js', gulp.series('clean:js', 'concat:js', 'min:js'));

gulp.task('default:css', gulp.series('clean:css', 'less'));

gulp.task('default:html', function() {
    return gulp.src('src/html/*/*.html').pipe(gulp.dest('dist'));
});

gulp.task('watch:js', function () {
    return gulp.watch('src/js/**/*.js', gulp.series('default:js'));
});

gulp.task('watch:css', function () {
    return gulp.watch('src/styles/less/**/*.less', gulp.series('default:css'));
});

gulp.task('watch:html', function () {
    return gulp.watch('src/html/templates/*.html', gulp.series('default:html'));
});

gulp.task('build', function() {
    var jsSourceFiles = [
                        'node_modules/jquery/dist/jquery.slim.min.js',
                        'node_modules/popper.js/dist/umd/popper.min.js',
                        'node_modules/angular/angular.min.js',
                        'node_modules/angular-route/angular-route.min.js',
                        'node_modules/bootstrap/dist/js/bootstrap.min.js']

    var cssSourceFiles = ['node_modules/bootstrap/dist/css/*.min.css',
                          'src/styles/css/site.min.css'];

    gulp.src(jsSourceFiles)
        .pipe(gulp.dest('dist/js'));
    gulp.src(cssSourceFiles)
        .pipe(gulp.dest('dist/css'));
    gulp.src('src/html/*/*.html')
        .pipe(gulp.dest('dist'));
    gulp.src('src/assets/*')
        .pipe(gulp.dest('dist'));
    return gulp.src('src/html/index.html')
        .pipe(gulp.dest('dist'));

})

gulp.task('default', gulp.series('clean', 'less', 'concat:js', 'min:js', 'build'));