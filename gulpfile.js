const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');

const dirs = {
  sass: 'public/styles/*.scss',
  js: 'public/scripts/*.js',
  vectors: 'public/vectors/*'
}

gulp.task('styles', () => {
  return gulp.src(dirs.sass)
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['client/style']
    }).on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', () => {
  return gulp.src(dirs.js)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('vectors', () => {
  return gulp.src(dirs.vectors)
  .pipe(gulp.dest('dist/vectors'));
});

gulp.task('server', () => {
  nodemon({
    script: 'index.js',
    ignore: ['public/', 'dist/'],
    ext: 'js'
  });
});

gulp.task('watch', ['server'], () => {
  gulp.watch(dirs.sass, ['styles']);
  gulp.watch(dirs.js, ['scripts']);
  gulp.watch(dirs.vectors, ['vectors']);
});

gulp.task('default', ['styles', 'scripts', 'vectors', 'watch']);
