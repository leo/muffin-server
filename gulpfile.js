const gulp = require('gulp'),
      babel = require('gulp-babel'),
      sass = require('gulp-sass'),
      concat = require('gulp-concat'),
      nodemon = require('gulp-nodemon');

const dirs = {
  sass: 'public/styles/*.scss',
  js: 'public/scripts/*.js',
  vectors: 'public/vectors/*'
}

gulp.task('styles', function() {
  return gulp.src(dirs.sass)
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['public/styles']
    }).on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
  return gulp.src(dirs.js)
    .pipe(concat('app.js'))
    .pipe(babel({
      presets: ['es2015'],
      compact: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('vectors', function() {
  return gulp.src(dirs.vectors)
  .pipe(gulp.dest('dist/vectors'));
});

gulp.task('server', function() {
  nodemon({
    script: 'index.js',
    ignore: ['public/', 'dist/'],
    ext: 'js hbs'
  });
});

gulp.task('watch', ['server'], function() {
  gulp.watch(dirs.sass, ['styles']);
  gulp.watch(dirs.js, ['scripts']);
  gulp.watch(dirs.vectors, ['vectors']);
});

gulp.task('default', ['styles', 'scripts', 'vectors']);
