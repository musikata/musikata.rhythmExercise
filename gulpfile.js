var gulp = require('gulp');
var compass = require('gulp-compass');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var prefix = require('gulp-autoprefixer');
var cssmin = require('gulp-csso');
var sass = require('gulp-ruby-sass');
var htmlmin = require('gulp-minify-html');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var stylish = require('jshint-stylish');


// Set variables

var env,
    outputDir,
    sassStyle;

env = 'development';

if (env === 'development') {
    outputDir = 'src/';
    sassStyle = 'expanded';
} else {
    outputDir = 'dist/';
    sassStyle = 'compressed';
}

// Set specific tasks

// Compile compass and sass

// If use compass use this task to compile Sass/Compass

gulp.task('compass', function() {
    return gulp.src('src/sass/**/*.scss')
        .pipe(compass({
            sass: 'src/sass/',
            css: 'src/css',
            style: 'expanded'
        }))
        .pipe(prefix('last 2 version'))
        .pipe(gulp.dest('src/css'));
});

// If you don't use Compass ,
// use this task to compile sass (more fast then compass)

gulp.task('sass', function() {
    gulp.src('src/sass/**/*.scss')
        .pipe(sass({
            style: 'expanded',
	        require: ['susy','breakpoint']

        }))
        .pipe(gulp.dest('src/css/'));
});

//move image folder in build folder
gulp.task('move', function() {
    return gulp.src('src/images/**/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest('dist/images'));
});

// minify js files
gulp.task('uglify', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

// hinting and linting js files
gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));

});

//minify css files
gulp.task('cssmin', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});

//minify html files
gulp.task('htmlmin', function() {
    return gulp.src('src/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('dist/'));
});


//init browser sync via live reloads
gulp.task('browser', function() {
    browserSync.init(['src/css/**/*.css', 'src/*.html', 'src/js/**/*.js'], {
        server: {
            baseDir: outputDir
        }
    });
});

// watch file changes
gulp.task('watch', function() {
    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['js']);

});

gulp.task('build', ['sass', 'js', 'htmlmin', 'cssmin', 'uglify', 'move']);

gulp.task('default', ['sass', 'js', 'watch', 'browser']);
