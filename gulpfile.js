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
        .pipe(concat('src/styles/css/site.css'))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('min:js', function () {
    return gulp.src(['src/js/services/*.js', 'src/js/*.js', 'src/js/controllers/*.js'])
        .pipe(concat('src/js/bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});

gulp.task('clean', function () {
    return del(['styles/css/site.min.css', 'src/js/bundle.js']);
});

gulp.task('clean:js', function () {
    return del('src/js/bundle.js');
});

gulp.task('clean:css', function () {
    return del('styles/css/site.min.css');
});

gulp.task('default:js', gulp.series('clean:js', 'min:js'));

gulp.task('default:css', gulp.series('clean:css', 'less'));

gulp.task('watch:js', function () {
    return gulp.watch('styles/js/*.js', gulp.series('default:js'));
});

gulp.task('watch:css', function () {
    return gulp.watch('styles/less/**/*.less', gulp.series('default:css'));
});

gulp.task('build', function() {
    var jsSourceFiles = ['src/js/bundle.js',
                        'node_modules/jquery/dist/jquery.slim.min.js',
                        'node_modules/popper.js/dist/umd/popper.min.js',
                        'node_modules/angular/angular.min.js',
                        'node_modules/angular-route/angular-route.min.js',
                        'node_modules/bootstrap/dist/js/bootstrap.min.js']

    var cssSourceFiles = ['node_modules/bootstrap/dist/css/*.min.css',
                          'src/styles/css/site.min.css'];

    del('dist/js/*');
    del('dist/css/*');
    del('dist/html/*');
    del('dist/*');

    gulp.src(jsSourceFiles)
        .pipe(gulp.dest('dist/js'));
    gulp.src(cssSourceFiles)
        .pipe(gulp.dest('dist/css'));
    gulp.src('src/html/*/*.html')
        .pipe(gulp.dest('dist'));
    return gulp.src('src/html/index.html')
        .pipe(gulp.dest('dist'));

})

gulp.task('default', gulp.series('clean', 'less', 'min:js', 'build'));