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
  sass: 'build/styles/*.scss',
  js: 'build/scripts/**/*.js',
  vectors: 'build/vectors/*'
}

gulp.task('styles', function () {
  return gulp.src(dirs.sass)
    .pipe(concat('styles.scss'))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['build/styles']
    }).on('error', sass.logError))
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
})

gulp.task('scripts', function () {
  return gulp.src('build/scripts/app.js', { read: false })
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

gulp.task('server', ['watch'], function () {
  nodemon({
    script: 'index.js',
    ignore: ['build/', 'dist/'],
    ext: 'js hbs'
  }).on('restart', function () {
    process.env.restarted = true
  })
})

gulp.task('watch', function () {
  livereload.listen()

  gulp.watch(dirs.sass, ['styles'])
  gulp.watch(dirs.js, ['scripts'])
})

gulp.task('default', ['styles', 'scripts'])
