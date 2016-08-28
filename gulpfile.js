var gulp   = require('gulp');
var sass   = require('gulp-sass');
var gutil = require('gulp-util');

gulp.task('default', ['build-css']);

gulp.task('build-css', function() {
  return gulp.src('src/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css/main.css'));
});

