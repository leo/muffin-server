const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

gulp.task('scss', () => {
  return gulp.src('client/style/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['client/style']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('js', () => {
  return gulp.src('client/source/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch('client/style/*.scss', ['scss']);
  gulp.watch('client/source/*.js', ['js']);
});

gulp.task('default', ['scss', 'js', 'watch'] );
