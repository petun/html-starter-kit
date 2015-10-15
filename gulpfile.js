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
    del = require('del'),
    jade = require('gulp-jade');


 function logError (err) {
     console.log(err);
 }


gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('dist/lib/'))
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
    return gulp.src(['src/js/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('jade', function() {
    var YOUR_LOCALS = {};

    return gulp.src("./src/jade/*.jade")
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        })).on('error', logError)
        .pipe(gulp.dest("./dist/"))
        .pipe(livereload());
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
    gulp.watch('./src/scss/**/*.scss', ['styles']);
    gulp.watch('./src/jade/**/*.jade', ['jade']);
    gulp.watch('./src/js/**/*.js', ['scripts']);
});


gulp.task('default', ['styles', 'scripts', 'bower', 'slim']);