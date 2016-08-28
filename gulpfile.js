var gulp   = require('gulp');
var sass   = require('gulp-sass');
var gutil = require('gulp-util'); 
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', ['build-css','build-js']);

gulp.task('build-css', function() {
  return gulp.src('src/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css/stylesheet'));
});

gulp.task('build-js', function() {
  return gulp.src(['./src/app/app.js', './src/lib/angularjs-dropdown-multiselect.js',
   './src/controllers/ListController.js','./src/controllers/RegisterController.js','./src/services/apiservice.js',
   './src/directives/listAnime.js','./src/directives/modalDialog.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/javascript'));
});
