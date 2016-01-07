const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const nodemon = require('gulp-nodemon')
const rollup = require('gulp-rollup')
const uglify = require('gulp-uglify')

const babel = require('rollup-plugin-babel')

const dirs = {
  sass: 'public/styles/*.scss',
  js: 'public/scripts/app.js',
  vectors: 'public/vectors/*'
}

gulp.task('styles', function () {
  return gulp.src(dirs.sass)
    .pipe(concat('styles.scss'))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['public/styles']
    }).on('error', sass.logError))
    .pipe(gulp.dest('dist'))
})

gulp.task('scripts', function () {
  return gulp.src(dirs.js, { read: false })
    .pipe(rollup({
      plugins: [
        babel({
          presets: ['es2015-rollup']
        })
      ]
    })).on('error', console.error)
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('vectors', function () {
  return gulp.src(dirs.vectors)
    .pipe(gulp.dest('dist/vectors'))
})

gulp.task('server', function () {
  nodemon({
    script: 'index.js',
    ignore: ['public/', 'dist/'],
    ext: 'js hbs'
  })
})

gulp.task('watch', ['server'], function () {
  gulp.watch(dirs.sass, ['styles'])
  gulp.watch(dirs.js, ['scripts'])
  gulp.watch(dirs.vectors, ['vectors'])
})

gulp.task('default', ['styles', 'scripts', 'vectors'])
