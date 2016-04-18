const gulp = require('gulp')
const babel = require('gulp-babel')
const cache = require('gulp-cached')

const paths = [
  'lib/**/*',
  'routes/**/*',
  'models/**/*',
]

gulp.task('transpile', () => {
  return gulp.src(paths.lib)
  .pipe(cache('transpile'))
  .pipe(babel())
  .pipe(gulp.dest('dist'))
})

gulp.task('watch', () => {
  gulp.watch(paths.lib, ['transpile'])
})

gulp.task('default', ['watch', 'transpile'])
