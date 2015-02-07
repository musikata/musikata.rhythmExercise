var gulp = require('gulp');
var config = require('../config').plainJs;
var browserSync  = require('browser-sync');

gulp.task('plainJs', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
