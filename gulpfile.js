const gulp = require('gulp')
const sass = require('gulp-sass')
const livereload = require('gulp-livereload')
const concat = require('gulp-concat')
const rollup = require('gulp-rollup')
const uglify = require('gulp-uglify')
const nodemon = require('gulp-nodemon')

const babel = require('rollup-plugin-babel')

const dirs = {
  sass: 'public/styles/*.scss',
  js: 'public/scripts/**/*.js',
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
    .pipe(livereload())
})

gulp.task('scripts', function () {
  return gulp.src('public/scripts/app.js', { read: false })
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

gulp.task('vectors', function () {
  return gulp.src(dirs.vectors)
    .pipe(gulp.dest('dist/vectors'))
    .pipe(livereload())
})

gulp.task('server', function () {
  nodemon({
    script: 'index.js',
    ignore: ['public/', 'dist/'],
    ext: 'js hbs'
  }).on('restart', function () {
    process.env.restarted = true
  })
})

gulp.task('watch', ['server'], function () {
  livereload.listen()

  gulp.watch(dirs.sass, ['styles'])
  gulp.watch(dirs.js, ['scripts'])
  gulp.watch(dirs.vectors, ['vectors'])
})

gulp.task('default', ['styles', 'scripts', 'vectors'])
