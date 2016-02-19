const gulp = require('gulp')
const sass = require('gulp-sass')
const refresh = require('gulp-refresh')
const concat = require('gulp-concat')
const nodemon = require('gulp-nodemon')

const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonJS = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')

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
    .pipe(refresh())
})

gulp.task('scripts', () => {
  return rollup({
    entry: 'assets/js/app.js',
    plugins: [
      babel({
        presets: ['es2015-rollup']
      }),
      nodeResolve({
        jsnext: true
      }),
      commonJS(),
      uglify()
    ]
  }).then(bundle => {
    return bundle.write({
      dest: 'dist/app.js'
    })
  })
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
  }).on('restart', () => process.env.restarted = true)
})

gulp.task('watch', () => {
  refresh.listen()

  gulp.watch(paths.scss, ['styles'])
  gulp.watch(paths.js, ['scripts'])
  gulp.watch(paths.images, ['images'])
})

gulp.task('default', ['styles', 'scripts', 'images'])
