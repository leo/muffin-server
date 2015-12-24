const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

gulp.task('scss', () => {
  return gulp.src('client/style/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['client/style']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('js', () => {
  return gulp.src('client/source/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('vectors', () => {
  return gulp.src('client/vectors/*')
  .pipe(gulp.dest('dist/vectors'));
});

gulp.task('watch', () => {
  gulp.watch('client/style/*.scss', ['scss']);
  gulp.watch('client/source/*.js', ['js']);
  gulp.watch('client/assets/*', ['vectors']);
});

gulp.task('default', ['scss', 'js', 'vectors', 'watch'] );
