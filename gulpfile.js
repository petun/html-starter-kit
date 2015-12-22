var gulp = require('gulp'),
    bower = require('gulp-bower'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),
    del = require('del'),
    jade = require('gulp-jade');


gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('dist/lib/'))
});

gulp.task('vendor', function() {
    return gulp.src('./src/vendor/**/*').pipe(gulp.dest('dist/vendor'));
});

gulp.task('fonts', function() {
    return gulp.src('./src/fonts/**/*').pipe(gulp.dest('dist/fonts'));
});

gulp.task('styles', function() {
    return gulp.src('./src/scss/main.scss')
        .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError ))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload())
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
    gulp.src(['src/js/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify().on('error', function(){} ))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('jade', function() {
    var YOUR_LOCALS = {
        pageTitle: 'App Page Title'
    };

    return gulp.src("./src/jade/*.jade")
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        })).on('error', function(err) {
            console.log(err);
            this.emit('end');
        })
        .pipe(gulp.dest("./dist/"))
        .pipe(livereload())
        .pipe(notify({ message: 'Jade task complete' }));
});


gulp.task('images', function() {
    return gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function () {
    gulp.run('styles');
    gulp.run('jade');
    gulp.run('scripts');

    livereload.listen();

    watch(['./src/scss/**/*.scss'],function(){
        gulp.run('styles');
    });
    watch(['./src/jade/**/*.jade'],function(){
        gulp.run('jade');
    });
    watch(['./src/js/**/*.js'],function(){
        gulp.run('scripts');
    });
});


gulp.task('default', ['styles', 'scripts', 'bower', 'jade']);