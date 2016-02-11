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

const paths = {
  scss: 'assets/scss/**/*.scss',
  js: 'assets/js/**/*.js',
  images: 'assets/images/**/*'
}

gulp.task('styles', () => {
  return gulp
    .src(paths.scss)
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
    .src(paths.images)
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

  gulp.watch(paths.scss, ['styles'])
  gulp.watch(paths.js, ['scripts'])
  gulp.watch(paths.images, ['images'])
})

gulp.task('default', ['styles', 'scripts', 'images'])
