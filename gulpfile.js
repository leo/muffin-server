const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

gulp.task('scss', () => {
  return gulp.src('client/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['client/styles']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('js', () => {
  return gulp.src('client/src/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch('client/styles/*.scss', ['scss']);
  gulp.watch('client/src/*.js', ['js']);
});

gulp.task('default', ['scss', 'js', 'watch'] );
