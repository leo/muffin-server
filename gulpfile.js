const gulp = require('gulp')
const sass = require('gulp-sass')
const livereload = require('gulp-livereload')
const concat = require('gulp-concat')
const rollup = require('gulp-rollup')
const uglify = require('gulp-uglify')
const nodemon = require('gulp-nodemon')

const babel = require('rollup-plugin-babel')
const npm = require('rollup-plugin-npm')
const commonjs = require('rollup-plugin-commonjs')

const dirs = {
  scss: 'assets/scss/**/*.scss',
  js: 'assets/js/**/*.js',
  images: 'assets/images/**/*'
}

gulp.task('styles', () => {
  return gulp
    .src(dirs.scss)
    .pipe(concat('styles.scss'))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['assets/scss']
    }).on('error', sass.logError))
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
})

gulp.task('scripts', () => {
  return gulp
    .src('assets/js/app.js', { read: false })
    .pipe(rollup({
      plugins: [
        babel({
          presets: ['es2015-rollup']
        }),
        npm({
          main: true,
          jsnext: true
        }),
        commonjs({
          include: 'node_modules/**',
          exclude: '**/*.css'
        })
      ]
    })).on('error', console.error)
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
})

gulp.task('images', () => {
  return gulp
    .src(dirs.images)
    .pipe(gulp.dest('dist/images'))
})

gulp.task('server', ['watch'], () => {
  nodemon({
    script: 'index.js',
    ignore: ['assets/', 'dist/'],
    ext: 'js hbs'
  }).on('restart', function () {
    process.env.restarted = true
  })
})

gulp.task('watch', () => {
  livereload.listen()

  gulp.watch(dirs.scss, ['styles'])
  gulp.watch(dirs.js, ['scripts'])
  gulp.watch(dirs.images, ['images'])
})

gulp.task('default', ['styles', 'scripts', 'images'])
