const gulp = require('gulp')
const sass = require('gulp-sass')
const livereload = require('gulp-livereload')
const concat = require('gulp-concat')
const rollup = require('gulp-rollup')
const uglify = require('gulp-uglify')
const nodemon = require('gulp-nodemon')

const babel = require('rollup-plugin-babel')

const dirs = {
  sass: 'assets/styles/*.scss',
  js: 'assets/scripts/**/*.js',
  vectors: 'assets/vectors/*'
}

gulp.task('styles', function () {
  return gulp.src(dirs.sass)
    .pipe(concat('styles.scss'))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['assets/styles']
    }).on('error', sass.logError))
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
})

gulp.task('scripts', function () {
  return gulp.src('assets/scripts/app.js', { read: false })
    .pipe(rollup({
      plugins: [
        babel({
          presets: ['es2015-rollup']
        })
      ]
    })).on('error', console.error)
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
})

gulp.task('server', function () {
  nodemon({
    script: 'index.js',
    ignore: ['assets/', 'dist/'],
    ext: 'js hbs'
  }).on('restart', function () {
    process.env.restarted = true
  })
})

gulp.task('watch', ['server'], function () {
  livereload.listen()

  gulp.watch(dirs.sass, ['styles'])
  gulp.watch(dirs.js, ['scripts'])
})

gulp.task('default', ['styles', 'scripts'])
