const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');

const dirs = {
  sass: 'client/styles/*.scss',
  js: 'client/scripts/*.js',
  vectors: 'client/vectors/*'
}

gulp.task('styles', () => {
  return gulp.src(dirs.sass)
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['client/styles']
    }).on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', () => {
  return gulp.src(dirs.js)
    .pipe(concat('app.js'))
    .pipe(babel({
      presets: ['es2015'],
      compact: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('vectors', () => {
  return gulp.src(dirs.vectors)
  .pipe(gulp.dest('dist/vectors'));
});

gulp.task('server', () => {
  nodemon({
    script: 'index.js',
    ignore: ['client/', 'dist/'],
    ext: 'js'
  });
});

gulp.task('watch', ['server'], () => {
  gulp.watch(dirs.sass, ['styles']);
  gulp.watch(dirs.js, ['scripts']);
  gulp.watch(dirs.vectors, ['vectors']);
});

gulp.task('default', ['styles', 'scripts', 'vectors', 'watch']);
